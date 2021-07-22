from flask import Flask,render_template,redirect,url_for,send_file
from flask_sslify import SSLify
app = Flask(__name__)
sslify = SSLify(app)
@app.route('/')
def index():
    return redirect(url_for("socials"))
@app.route('/main')
def main():
    return render_template("mainpage.html")
@app.route('/socials')
def socials():
    return render_template("socials.html")
@app.route('/shutdowntimer')
def shutdowntimer():
    return render_template("shutdowntimer.html")
@app.route('/download')
def download_file():
    p = "ShutdownTimer.exe"
    return send_file(p,as_attachment=True)
@app.route('/projects')
def projects():
    return render_template("projects.html")
@app.route('/all')
def all():
    return render_template("all.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
if __name__ == '__main__':
    app.run(debug=True)