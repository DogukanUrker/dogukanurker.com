from flask import Flask, render_template, redirect, url_for, send_file
# Import necessary functions from the Flask module

from flask_sslify import SSLify
# Import SSLify to force HTTPS

from requests import request
# Import the request function from the requests module

app = Flask(__name__)
# Initialize a Flask app

sslify = SSLify(app)
# Enable SSL for the Flask app

githubAPI = "https://api.github.com/"
# Base URL for the GitHub API


@app.route("/")
def home():
    return render_template("index.html")
# Define the home route which renders the index.html template


token = open("token.txt", "r").read().strip("\n")
# Read the GitHub API token from a file and remove the newline character

payload = {}
# Initialize an empty payload for the API request

headers = {"Authorization": f'Bearer {token}'}
# Set up the headers for the API request with the authorization token


def queryAPI(url):
    return request("GET", url, headers=headers, data=payload).json()
# Define a function to make a GET request to the provided URL and return the JSON response


@app.route("/<projectName>")
def project(projectName):
    projectNames = []
    repos = queryAPI(githubAPI + "users/dogukanurker/repos?per_page=100")
    # Query the GitHub API to get the user's repositories

    for repo in repos:
        projectNames += (repo["name"].lower(),)
    # Collect all project names in lowercase

    if projectName.lower() in projectNames:
        response = queryAPI(githubAPI + "repos/dogukanurker/" + projectName)
        # If the project name exists, get the repository details

        repo = response
        repoName = repo["name"]
        repoDescription = repo["description"]
        repoLanguages = list(queryAPI(repo["languages_url"]).keys())
        repoStars = repo["stargazers_count"]
        repoForks = repo["forks"]
        repoLicense = repo["license"]["spdx_id"]
        repoWatchers = repo["subscribers_count"]
        repoUrl = repo["html_url"]
        repoContributors = queryAPI(repo["contributors_url"])
        # Retrieve various details about the repository

        repoContributorsImage = []
        for contributor in repoContributors:
            repoContributorsImage.append(contributor["avatar_url"])
        # Collect the avatar URLs of the contributors

        return render_template(
            "project.html",
            name=repoName,
            description=repoDescription,
            languages=repoLanguages,
            stars=repoStars,
            forks=repoForks,
            watchers=repoWatchers,
            license=repoLicense,
            url=repoUrl,
            contributors=repoContributorsImage,
        )
        # Render the project.html template with the repository details

    return redirect(url_for("home"))
    # If the project name does not exist, redirect to the home page


@app.errorhandler(404)
def notFound(e):
    return redirect(url_for("home"))
# Define a custom 404 error handler to redirect to the home page


@app.route("/cv")
def cv():
    return send_file("static/cv.pdf")
# Define the cv route to send the cv.pdf file


@app.route("/projects")
def projects():
    repos = queryAPI(githubAPI + "users/dogukanurker/repos?per_page=100")
    # Query the GitHub API to get the user's repositories

    repoData = []
    for repo in repos:
        if not repo["fork"] and not repo["private"]:
            repoName = repo["name"]
            repoDescription = repo["description"]
            repoData.append({"name": repoName, "description": repoDescription})
    # Collect data of non-forked and public repositories

    return render_template("projects.html", repos=repoData)
    # Render the projects.html template with the repository data


@app.route("/socials")
def socials():
    return render_template("socials.html")
# Define the socials route which renders the socials.html template


@app.route("/donate")
def donate():
    return redirect("https://www.buymeacoffee.com/dogukanurker")
# Define the donate route to redirect to the Buy Me a Coffee page


if __name__ == "__main__":
    app.run()
# Run the Flask app