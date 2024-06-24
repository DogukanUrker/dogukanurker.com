from flask import Flask, render_template, redirect, url_for, send_file
from flask_sslify import SSLify
from requests import get

app = Flask(__name__)
sslify = SSLify(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.errorhandler(404)
def notFound(e):
    return redirect(url_for("home"))


@app.route("/cv")
def cv():
    return send_file("static/cv.pdf")


@app.route("/projects")
def projects():
    response = get("https://api.github.com/users/dogukanurker")
    data = response.json()
    followerCount = data["followers"]
    repoCount = data["public_repos"]
    return render_template("projects.html", followers=followerCount, repos=repoCount)


@app.route("/socials")
def socials():
    return render_template("socials.html")


@app.route("/donate")
def donate():
    return redirect("https://www.buymeacoffee.com/dogukanurker")


if __name__ == "__main__":
    app.run(debug=True, host="192.168.1.70")
