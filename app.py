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


@app.route("/flasktodo")
def flaskToDo():
    return render_template("flaskToDo.html")


@app.route("/flaskblog")
def flaskBlog():
    return render_template("flaskBlog.html")


@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host=socket.gethostbyname(socket.gethostname()))
