import socket
from flask_sslify import SSLify
from flask import Flask, render_template

app = Flask(__name__)
sslify = SSLify(app)


@app.route("/")
def index():
    return render_template("socials.html")


@app.route("/shutdowntimer")
def shutdowntimer():
    return render_template("shutdowntimer.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host=socket.gethostbyname(socket.gethostname()))
