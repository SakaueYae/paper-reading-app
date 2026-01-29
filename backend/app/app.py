import base64
import datetime
import json
import uuid
from flask import Flask, jsonify, request
from langchain_text_splitters import CharacterTextSplitter
import pymupdf
from langchain_community.document_loaders import PyMuPDFLoader
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
from supabase import create_client, Client
import os

# from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain, create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from flask_cors import CORS

# .env ファイルから環境変数を読み込み
load_dotenv()

# 環境変数からSupabase情報を取得
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")


# Supabaseクライアントの作成
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)


# if os.getenv("FLASK_ENV") == "development":
#     allowed_origins = os.getenv("ALLOWED_ORIGINS_DEV", "").split(",")
# else:
#     allowed_origins = os.getenv("ALLOWED_ORIGINS_PROD", "").split(",")


# CORS(
#     app,
#     origins=allowed_origins,
#     supports_credentials=True,
#     allow_headers=["Content-Type", "Authorization", "X-Refresh-Token"],
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
# )


@app.route("/")
def index():
    return "Index Page"


@app.route("/hello")
def hello():
    return "Hello, World"


@app.route("/api/data", methods=["GET"])
def get_data():
    data = {"name": "taro", "age": 30, "job": "developer"}
    return jsonify(data)


# JWTトークンから情報を抽出する関数（簡易版）
def parse_jwt_payload(token):
    try:
        # JWTの形式: ヘッダー.ペイロード.署名
        token_parts = token.split(".")
        if len(token_parts) >= 2:
            # Base64URLエンコードされたペイロード部分を取得
            payload_part = token_parts[1]
            # Base64URLデコード用にパディングを調整
            payload_part += "=" * (-len(payload_part) % 4)
            # デコードしてJSONとして解析
            decoded = base64.urlsafe_b64decode(payload_part)
            return json.loads(decoded)
        return None
    except Exception as e:
        print(f"Failed to parse JWT: {e}")
        return None


# 勝手に実装
def get_token_and_set_session(headers):
    try:
        # 認証ヘッダーの検証
        auth_header = headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"status": "error", "message": "Invalid token"}, 401

        # トークン抽出
        access_token = auth_header.replace("Bearer ", "")
        refresh_token = headers.get("X-Refresh-Token")

        # トークンからペイロードを取得
        payload = parse_jwt_payload(access_token)
        if not payload:
            return jsonify({"status": "error", "message": "Invalid token"}), 401

        # ユーザーIDの取得（Supabaseトークンでは通常'sub'キーに格納されています）
        user_id = payload.get("sub")

        if not user_id:
            return {"status": "error", "message": "User ID not found in token"}, 401

        supabase.auth.set_session(access_token, refresh_token)

        return user_id
    except Exception as e:
        print(f"Error getting user: {e}")
        return None


# チャットセッションを作成または取得
def get_or_create_chat_session(user_id, session_id=None, title: str = None):
    if session_id:
        # 既存のセッションを取得
        response = (
            supabase.table("chat_sessions")
            .select("*")
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        if response.data:
            return response.data[0]

    # 新しいセッションを作成
    session_title = title or f"チャットセッション {uuid.uuid4().hex[:8]}"
    response = (
        supabase.table("chat_sessions")
        .insert({"user_id": user_id, "title": session_title})
        .execute()
    )

    return response.data[0]


# セッションのメッセージ履歴を取得
def get_chat_history(session_id):
    response = (
        supabase.table("messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    return response.data


def get_pdf_text(session_id):
    response = (
        supabase.table("chat_sessions")
        .select("document_text")
        .eq("id", session_id)
        .execute()
    )

    return response.data[0]["document_text"]


# メッセージを保存
def save_message(session_id, content, role):
    response = (
        supabase.table("messages")
        .insert({"session_id": session_id, "content": content, "role": role})
        .execute()
    )
    return response.data[0]


# LangChainのメモリを初期化
def initialize_memory_from_history(messages):
    memory = ConversationBufferMemory(return_messages=True)

    for msg in messages:
        if msg["role"] == "user":
            memory.chat_memory.add_user_message(msg["content"])
        elif msg["role"] == "assistant":
            memory.chat_memory.add_ai_message(msg["content"])

    return memory


def build_chain(text: str, memory: ConversationBufferMemory):
    char_text_splitter = CharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=0,
    )
    doc = char_text_splitter.split_text(text)
    # print(doc)

    # Load embeddings model
    embeddings = GoogleGenerativeAIEmbeddings(
        google_api_key=GOOGLE_API_KEY, model="models/gemini-embedding-001"
    )
    # PDFファイルのテキストを注入して疑似的にファイル検索を行う
    pdf_search = FAISS.from_texts(
        doc,
        embeddings,
        # collection_name=file_name,
    )

    retriever_prompt = ChatPromptTemplate.from_messages(
        [
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            (
                "user",
                "Given the above conversation, generate a search query to look up information relevant to the conversation",
            ),
        ]
    )

    llm = ChatGoogleGenerativeAI(
        temperature=0.7,
        # 2026年6月17日に提供終了
        # https://ai.google.dev/gemini-api/docs/deprecations?hl=ja
        model="gemini-2.5-flash",
        google_api_key=GOOGLE_API_KEY,
    )

    history_aware_retriever = create_history_aware_retriever(
        llm,
        prompt=retriever_prompt,
        retriever=pdf_search.as_retriever(),
    )

    # ステップ2: 検索結果を使った回答生成チェーンを作成
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Answer the user's question based on the following context. Use Markdown formatting in your response.\n\nContext:\n\n{context}",
            ),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
        ]
    )

    qa_chain = create_stuff_documents_chain(llm, prompt)

    retrieval_chain = create_retrieval_chain(history_aware_retriever, qa_chain)

    return retrieval_chain


@app.route("/api/pdf", methods=["POST"])
def upload_pdf():
    # start = time.time()
    user_id = get_token_and_set_session(request.headers)

    if not user_id:
        return jsonify(
            {"status": "error", "message": "ユーザー認証に失敗しました"}
        ), 401

    if not request.files:
        return "No file part", 400

    file_name = ""
    for key, file in request.files.items():
        if file.filename == "":
            return "No selected file", 400

        file_name = file.filename
        doc = pymupdf.open(stream=file.read(), filetype="pdf")

        WHITE = pymupdf.pdfcolor["white"]
        textflags = pymupdf.TEXT_DEHYPHENATE
        translator = GoogleTranslator(source="auto", target="ja")
        ocg = doc.add_ocg("Japanese", on="True")

        file_text = ""

        for page_num in range(len(doc)):
            page = doc[page_num]
            blocks = page.get_text("blocks", flags=textflags)
            for block in blocks:
                bbox = block[:4]
                text = block[4]
                ja = ""
                i = 0
                # 改行を消すことで翻訳精度を向上
                text = text.replace("\n", " ").replace("\r", " ")
                file_text += text
                if len(text) >= 5000:
                    while i < len(text):
                        selectedText = text[i : i + 4000]
                        ja += translator.translate(selectedText)
                        i += 4000
                else:
                    ja = translator.translate(text)
                page.draw_rect(bbox, color=None, fill=WHITE, oc=ocg)
                if isinstance(ja, str):
                    page.insert_htmlbox(bbox, ja, oc=ocg)

        doc.subset_fonts()
        pdf_bytes = doc.write(garbage=4, deflate=True, compression_effort=100)
        doc.close()
        # print(f"write took: {time.time() - start:.2f}s")
        # print(len(pdf_bytes))

    # 現在の日時をタイムスタンプに変換（例: 20250412_143015）
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    # 拡張子を分ける
    name_without_ext, ext = os.path.splitext(file_name)
    # タイムスタンプ付きのファイル名を作成
    unique_name = f"{name_without_ext}_{timestamp}_ja{ext}"
    # アップロード先のパスを指定
    upload_path = f"{user_id}/{unique_name}"

    try:
        session = get_or_create_chat_session(user_id, session_id=None, title=file_name)
        session_id = session["id"]
        (
            # 翻訳前と後のファイル名を保存
            supabase.table("chat_sessions")
            .update(
                {
                    "document_text": file_text,
                    "uploaded_file_name": file_name,
                    "translated_file_name": unique_name,
                }
            )
            .eq("id", session_id)
            .execute()
        )

        # Supabaseへファイル名と決まり文句を保存
        save_message(
            session_id,
            "上記のアイコンをクリックすると、翻訳ファイルをダウンロードできます。セキュリティ保護のため、AIが提供するファイルダウンロードリンクは生成から5分後に期限切れとなります。期限切れ後にファイルが必要な場合は、チャットを更新するか再度リクエストしてください。\n\n続けてファイル内容についての質問があればテキストボックスに入力して送信してください。",
            "assistant",
        )

        # Supabaseにアップロード
        supabase.storage.from_("file").upload(
            path=upload_path,
            file=pdf_bytes,  # バイナリデータを直接渡す
            file_options={"content-type": "application/pdf"},
        )

        signed_url_response = supabase.storage.from_("file").create_signed_url(
            path=upload_path, expires_in=300
        )
        signed_url = signed_url_response.get("signedURL")

        return {
            "status": "success",
            "download_url": signed_url,
            "file_name": unique_name,
            "session_id": session_id,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500


@app.route("/api/chat", methods=["POST"])
def chat():
    # リクエストからデータを取得
    data = request.json
    message = data.get("message")
    session_id = data.get("session_id")

    user_id = get_token_and_set_session(request.headers)

    if not user_id:
        return jsonify(
            {"status": "error", "message": "ユーザー認証に失敗しました"}
        ), 401

    try:
        # セッションを取得または作成
        session = get_or_create_chat_session(user_id, session_id)
        session_id = session["id"]

        # ユーザーメッセージを保存
        save_message(session_id, message, "user")

        # セッションの履歴を取得
        chat_history = get_chat_history(session_id)

        # LangChainのメモリを初期化
        memory = initialize_memory_from_history(chat_history)

        pdf_text = get_pdf_text(session_id)

        if not pdf_text:
            return jsonify(
                {"status": "error", "message": "PDFがアップロードされていません"}
            ), 400

        pdf_chat = build_chain(pdf_text, memory)
        # AIの応答を生成
        result = pdf_chat.invoke(
            {"input": message, "chat_history": memory.chat_memory.messages}
        )

        # AIの応答を保存
        save_message(session_id, result["answer"], "assistant")
        # print(f"AI response: {result['answer']}")

        return jsonify(
            {"status": "success", "response": result["answer"], "session_id": session_id}
        )
    except Exception as e:
        # エラーの詳細をログに出力
        error_type = type(e).__name__
        error_module = type(e).__module__
        error_message = str(e)

        # Google API のクォータエラー（429）の場合
        if "ResourceExhausted" in error_type or "429" in error_message:
            return jsonify({
                "status": "error",
                "error_type": "quota_exceeded",
                "message": "APIの利用制限に達しました。しばらく待ってから再度お試しください。",
                "details": error_message
            }), 429

        # その他のGoogle APIエラー
        elif "google.api_core.exceptions" in error_module:
            return jsonify({
                "status": "error",
                "error_type": "api_error",
                "message": f"AI APIでエラーが発生しました: {error_type}",
                "details": error_message
            }), 500

        # その他の一般的なエラー（データベースエラーなど）
        else:
            return jsonify({
                "status": "error",
                "error_type": "internal_error",
                "message": f"サーバー内部エラーが発生しました: {error_type}",
                "details": error_message
            }), 500

@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    user_id = get_token_and_set_session(request.headers)

    if not user_id:
        return jsonify(
            {"status": "error", "message": "ユーザー認証に失敗しました"}
        ), 401

    # ユーザーのセッション一覧を取得
    response = (
        supabase.table("chat_sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )

    return jsonify({"status": "success", "sessions": response.data})


@app.route("/api/sessions/<session_id>/messages", methods=["GET"])
def get_session_messages(session_id):
    user_id = get_token_and_set_session(request.headers)

    if not user_id:
        return jsonify(
            {"status": "error", "message": "ユーザー認証に失敗しました"}
        ), 401

    # セッションがユーザーのものか確認
    session_response = (
        supabase.table("chat_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not session_response.data:
        return jsonify(
            {"status": "error", "message": "セッションが見つかりません"}
        ), 404

    # メッセージを取得
    messages_response = (
        supabase.table("messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )

    # ファイル名取得
    res = (
        supabase.table("chat_sessions")
        .select("uploaded_file_name", "translated_file_name")
        .eq("id", session_id)
        .execute()
    )

    # print(res)

    # # メッセージの1つ目はアップロードしたファイル名、2つ目は翻訳後のファイル名に必ずなっている
    uploaded_file_name = res.data[0]["uploaded_file_name"]
    translated_file_name = res.data[0]["translated_file_name"]

    # print(uploaded_file_name, translated_file_name)

    file_url = None
    if translated_file_name:
        file_url = supabase.storage.from_("file").create_signed_url(
            path=f"{user_id}/{translated_file_name}", expires_in=300
        )["signedUrl"]

    return jsonify(
        {
            "status": "success",
            "messages": messages_response.data,
            "file_data": {
                "uploaded_file_name": uploaded_file_name,
                "translated_file_name": translated_file_name,
                "file_url": file_url,
            },
        }
    )


@app.route("/api/sessions/<session_id>", methods=["DELETE"])
def delete_session(session_id):
    user_id = get_token_and_set_session(request.headers)

    if not user_id:
        return jsonify(
            {"status": "error", "message": "ユーザー認証に失敗しました"}
        ), 401

    try:
        supabase.table("messages").delete().eq("session_id", session_id).execute()
        res = supabase.table("chat_sessions").delete().eq("id", session_id).execute()

        return {"status": "success", "message": res.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500


if __name__ == "__main__":
    app.run(debug=True)
