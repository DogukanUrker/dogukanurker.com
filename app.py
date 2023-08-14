import socket
import unicodedata
import smtplib, ssl
from flask_sslify import SSLify
from githubStats import getGitHubStats
from flask import Flask, render_template, redirect,send_file


app = Flask(__name__)
sslify = SSLify(app)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/donate")
def donate():
    return redirect("https://www.buymeacoffee.com/dogukanurker")


@app.route("/socials")
def socials():
    return render_template("socials.html")


@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.route("/shutdowntimer")
def shutdowntimer():
    return render_template(
        "shutdowntimer.html", repoStats=getGitHubStats("ShutdownTimer")
    )


@app.route("/flasktodo")
def flaskToDo():
    return render_template("flaskToDo.html", repoStats=getGitHubStats("flaskToDo"))


@app.route("/flaskblog")
def flaskBlog():
    return render_template("flaskBlog.html", repoStats=getGitHubStats("flaskBlog"))


@app.route("/flaskweather")
def flaskWeather():
    return render_template(
        "flaskWeather.html", repoStats=getGitHubStats("flaskWeather")
    )


@app.route("/flasknotes")
def flaskNotes():
    return render_template("flaskNotes.html", repoStats=getGitHubStats("flaskNotes"))


@app.route("/getimagesfromurl")
def getImagesFromURL():
    return render_template(
        "getImagesFromURL.html", repoStats=getGitHubStats("getImagesFromURL")
    )


@app.route("/passwordgenerator")
def passwordGenerator():
    return render_template(
        "passwordGenerator.html", repoStats=getGitHubStats("passwordGenerator")
    )


@app.route("/flaskecommerce")
def flaskecommerce():
    return render_template(
        "flaskecommerce.html", repoStats=getGitHubStats("flaskEcommerce")
    )


@app.route("/linktreeclone")
def LinktreeClone():
    return render_template(
        "LinktreeClone.html", repoStats=getGitHubStats("LinktreeClone")
    )

@app.route("/cv")
def cv():
    return send_file("static/cv.pdf")

@app.route(
    "/send/sendername=<senderName>/sendermail=<senderMail>/message=<content>/redirect=<direct>"
)
def send(senderName, senderMail, content, direct):
    content = content.replace("%20", " ")
    senderName = senderName.replace("%20", " ")
    message = f"Subject: Message from {senderName}\n\n {content} \n\n{senderName}\n {senderMail}"
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
