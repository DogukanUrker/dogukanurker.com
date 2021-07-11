from flask import Flask,render_template,flash,redirect,url_for,session,logging,request,g
from flask_sslify import SSLify
app = Flask(__name__)
sslify = SSLify(app)
@app.route('/')
def index():
    return redirect(url_for("links"))

@app.route('/links')
def links():
    return render_template("links.html")

@app.route('/shutdowntimer')
def shutdowntimer():
    return render_template("shutdowntimer.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404



if __name__ == '__main__':
    app.run(debug=True)