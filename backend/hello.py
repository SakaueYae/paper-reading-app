from flask import Flask, jsonify

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


if __name__ == "main":
    app.run(debug=True)
