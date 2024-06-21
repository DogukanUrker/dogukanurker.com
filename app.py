from flask import Flask
from flask_sslify import SSLify

app = Flask(__name__)
sslify = SSLify(app)


@app.route("/")
def hello():
    return "Doğukan Mete Ürker"


if __name__ == "__main__":
    app.run(debug=True)
