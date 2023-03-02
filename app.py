import socket
from flask_sslify import SSLify
from flask import Flask, render_template, redirect
import smtplib, ssl
import unicodedata

app = Flask(__name__)
sslify = SSLify(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/socials")
def socials():
    return render_template("socials.html")


@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.route("/shutdowntimer")
def shutdowntimer():
    return render_template("shutdowntimer.html")


@app.route("/flasktodo")
def flaskToDo():
    return render_template("flaskToDo.html")


@app.route("/flaskblog")
def flaskBlog():
    return render_template("flaskBlog.html")


@app.route("/flaskweather")
def flaskWeather():
    return render_template("flaskWeather.html")


@app.route("/flasknotes")
def flaskNotes():
    return render_template("flaskNotes.html")


@app.route(
    "/send/sendername=<senderName>/sendermail=<senderMail>/message=<content>/redirect=<direct>"
)
def send(senderName, senderMail, content, direct):
    content = content.replace("%20", " ")
    senderName = senderName.replace("%20", " ")
    message = f"Sender Name: {senderName}\n \nSender Mail: {senderMail} \n \nMessage:\n {content}"
    port = 587
    smtp_server = "smtp.gmail.com"
    context = ssl.create_default_context()
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login("dogukanurker.com@gmail.com", "zmlpagnpbzjjapvs")
        server.sendmail(
            "dogukanurker.com@gmail.com",
            "dogukanurker@icloud.com",
            unicodedata.normalize("NFKD", message).encode("ascii", "ignore"),
        )
    except Exception as exception:
        print(exception)
    finally:
        server.quit()
    return redirect(direct.replace("&", "/"))


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host=socket.gethostbyname(socket.gethostname()))
