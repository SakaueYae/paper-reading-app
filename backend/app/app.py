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
    fullHtml = ""
    for key, file in request.files.items():
        if file.filename == "":
            return "No selected file", 400
        pdf = pymupdf.open(stream=file.read(), filetype="pdf")
        for i in range(pdf.page_count):
            page = pdf.load_page(i)
            html = page.get_textpage().extractHTML()
            fullHtml += html
            print(html)

        # pdftext = pymupdf4llm.to_markdown(pdf)

        # text = pdf.load_page(0).get_text()

        index = 0
        fullText = ""

        while index + 1 <= len(fullHtml):
            tmpText = fullHtml[index : index + 4001]

            translatedText = GoogleTranslator(source="auto", target="ja").translate(
                text=tmpText
            )
            fullText += translatedText
            index += 4000

        story = pymupdf.Story(html=fullHtml)
        writer = pymupdf.DocumentWriter("output.pdf")
        MEDIABOX = pymupdf.paper_rect("A4")
        WHERE = MEDIABOX + (36, 36, -36, -36)  # leave borders of 0.5 inches

        more = 1  # will indicate end of input once it is set to 0

        while more:
            device = writer.begin_page(MEDIABOX)
            more, _ = story.place(WHERE)
            story.draw(device)
            writer.end_page()

        writer.close()

        # translatedPDF = GoogleTranslator(source="auto", target="ja").translate_file(
        #     "Improving English reading for EFL readers.pdf"
        # )
        # print(len(translatedText))
        return ""


if __name__ == "__main__":
    app.run(debug=True)
