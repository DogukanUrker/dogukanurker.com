from flask import Flask, render_template, redirect, url_for, send_file
from flask_sslify import SSLify

app = Flask(__name__)
sslify = SSLify(app)


@app.route("/")
def home():
    return render_template("index.html")

@app.errorhandler(404)
def notFound():
    return redirect(url_for('home'))

@app.route("/cv")
def cv():
    return send_file("static/cv.pdf")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/socials")
def socials():
    return render_template("socials.html")

@app.route("/donate")
def donate():
    return redirect("https://www.buymeacoffee.com/dogukanurker")

if __name__ == "__main__":
    app.run(debug=True)
