import base64
import json
from typing import Optional
from flask import Flask, jsonify, request
import pymupdf
from langchain_community.document_loaders import PyMuPDFLoader
from io import BytesIO
import pymupdf4llm
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
from supabase import create_client, Client
import os
import tempfile
import platform

# .env ファイルから環境変数を読み込み
load_dotenv()

# 環境変数からSupabase情報を取得
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
BUCKET_NAME = os.environ.get("BUCKET_NAME")

# Supabaseクライアントの作成
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)


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


@app.route("/api/pdf", methods=["POST"])
def upload_pdf():
    # 認証ヘッダーの検証
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"status": "error", "message": "Invalid token"}, 401

    # トークン抽出
    access_token = auth_header.replace("Bearer ", "")
    refresh_token = request.headers.get("X-Refresh-Token")

    # トークンからペイロードを取得
    payload = parse_jwt_payload(access_token)
    if not payload:
        return jsonify({"status": "error", "message": "Invalid token"}), 401

    # ユーザーIDの取得（Supabaseトークンでは通常'sub'キーに格納されています）
    user_id = payload.get("sub")
    if not user_id:
        return {"status": "error", "message": "User ID not found in token"}, 401

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

        for page in doc:
            blocks = page.get_text("blocks", flags=textflags)
            for block in blocks:
                bbox = block[:4]
                text = block[4]
                ja = ""
                i = 0
                if len(text) >= 5000:
                    while i < len(text):
                        selectedText = text[i : i + 4000]
                        # print(f"{i}:{selectedText}")
                        ja += translator.translate(selectedText)
                        i += 4000
                else:
                    ja = translator.translate(text)
                page.draw_rect(bbox, color=None, fill=WHITE, oc=ocg)
                if isinstance(ja, str):
                    page.insert_htmlbox(bbox, ja, oc=ocg)

        doc.subset_fonts()
        # doc.ez_save("output.pdf")
        pdf_bytes = doc.write()
        doc.close()

    # osによってtmpディレクトリがあるかどうかが異なる
    if platform.system() == "Windows":
        temp_dir = "tmp"
        os.makedirs(temp_dir, exist_ok=True)
    else:
        temp_dir = "/tmp"

    # 一時ファイルを作成
    fd, tmp_path = tempfile.mkstemp(suffix=".pdf", dir=temp_dir)

    try:
        # ファイルに書き込み
        with os.fdopen(fd, "wb") as tmp:
            tmp.write(pdf_bytes)

        supabase.auth.set_session(access_token, refresh_token)

        # Supabaseにアップロード
        file_name = os.path.basename(tmp_path)
        print(file_name)
        file_path = f"{user_id}/{file_name}"
        supabase.storage.from_("file").upload(
            path=file_path,
            file=pdf_bytes,  # バイナリデータを直接渡す
            file_options={"content-type": "application/pdf", "upsert": "true"},
        )

        signed_url_response = supabase.storage.from_("file").create_signed_url(
            path=file_path, expires_in=300
        )
        signed_url = signed_url_response.get("signedURL")

        return {"status": "success", "download_url": signed_url, "file_name": file_name}

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

    finally:
        # ファイルを削除
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


if __name__ == "__main__":
    app.run(debug=True)
