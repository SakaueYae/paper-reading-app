from flask import Flask, jsonify, request
import pymupdf
from langchain_community.document_loaders import PyMuPDFLoader
from io import BytesIO
import pymupdf4llm
from deep_translator import GoogleTranslator

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
        doc.ez_save("output.pdf")

        return ""


if __name__ == "__main__":
    app.run(debug=True)
