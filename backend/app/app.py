from flask import Flask, jsonify, request
import pymupdf
from langchain_community.document_loaders import PyMuPDFLoader
from io import BytesIO
import pymupdf4llm
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
from supabase import create_client, Client
import os
import requests

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


@app.route("/api/pdf", methods=["POST"])
def upload_pdf():
    if not request.files:
        return "No file part", 400
    for key, file in request.files.items():
        if file.filename == "":
            return "No selected file", 400
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

    try:
        # 2. アップロード
        upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/output.pdf"

        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/pdf",
            "x-upsert": "true",  # 上書き許可（false にするとエラーになる）
        }

        response = requests.put(upload_url, headers=headers, data=BytesIO(pdf_bytes))

        if response.status_code in [200, 201]:
            print("アップロード成功！")
        else:
            print("アップロード失敗:", response.status_code, response.text)

    except Exception as e:
        print("エラー発生:", e)

    return ""


if __name__ == "__main__":
    app.run(debug=True)
