from flask import Flask, jsonify, request
import fitz  # PyMuPDF
import os


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
        pdf = fitz.open(stream=file.read(), filetype="pdf")
        text = pdf.load_page(0).get_text()
        return text


if __name__ == "__main__":
    app.run(debug=True)
