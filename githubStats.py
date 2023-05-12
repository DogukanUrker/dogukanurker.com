import requests
from bs4 import BeautifulSoup as bs


def getGitHubStats(repo):
    stats = [repo]
    repoHTML = bs(
        requests.get(f"https://github.com/DogukanUrker/{repo}").text, "html.parser"
    )
    for data in repoHTML.find_all("div", class_="mt-2"):
        if None is not data.strong:
            stats.append(data.strong.string)
    return stats
