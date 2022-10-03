from flask import Flask, render_template, redirect, url_for
from flask_sslify import SSLify

app = Flask(__name__)
sslify = SSLify(app)


@app.route("/")
def index():
    return redirect(url_for("socials"))


@app.route("/socials")
def socials():
    return render_template("socials.html")


@app.route("/shutdowntimer")
def shutdowntimer():
    return render_template("shutdowntimer.html")


@app.route("/apps")
def projects():
    return render_template("apps.html")

@app.route("/sunu")
def sunu():
    return render_template("sunu.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
