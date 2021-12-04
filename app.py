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
@app.route('/apps')
def projects():
    return render_template("apps.html")
@app.route('/all')
def all():
    return render_template("all.html")
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
@app.route('/shutdowntimer.exe')
def shutdowntimer_exe():
    file = "ShutdownTimer/ShutdownTimer.exe"
    return send_file(file,as_attachment=True)
@app.route('/shutdowntimer-linux')
def shutdowntimer_linux():
    file = "ShutdownTimer/ShutdownTimer"
    return send_file(file,as_attachment=True)
@app.route('/shutdowntimersetup.exe')
def shutdowntimersetup_exe():
    file = "ShutdownTimer-Setup.exe"
    return send_file(file,as_attachment=True)
if __name__ == '__main__':
    app.run(debug=True)