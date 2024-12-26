export interface Repo {
    id: number;
    name: string;
    forks: number;
    license: {
        name: string;
        spdx_id: string;
    } | null;
    description: string;
    private: boolean;
    stargazers_count: number;
    language: string;
    html_url: string;
    languages_url: string;
    contributors_url: string;
    updated_at: number;
}

export interface Contributor {  // Exporting Contributor interface
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
}

export async function fetchRepos(username: string, token: string): Promise<Repo[]> {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
            'Authorization': `Bearer ${token.trim()}`
        }
    });
    let data: Repo[] = (await response.json())
        .sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count)
        .sort((a: Repo, b: Repo) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    const flaskBlogRepo = data.find(repo => repo.id === 566979145);
    if (flaskBlogRepo) {
        data = [flaskBlogRepo, ...data.filter(repo => repo.id !== 566979145)];
    }

    return data;
}

export async function fetchLanguages(url: string, token: string): Promise<Record<string, number>> {
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token.trim()}`
        }
    });
    return response.json();
}

export async function fetchContributors(url: string, token: string): Promise<Contributor[]> {
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token.trim()}`
        }
    });
    return response.json();
}

export async function fetchReadme(username: string, repo: string): Promise<string> {
    const response = await fetch(
        `https://raw.githubusercontent.com/${username}/${repo}/main/README.md`,
    );
    return response.text();
}