const {Octokit} = require("@octokit/core");
const {personalAccessToken} = require("./config");

const octokit = new Octokit({ auth: personalAccessToken });

async function main() {
    const {data} = await octokit.request('GET /orgs/{org}/repos', {
        org: 'qualityedgar',
        per_page: '100',
        page: '3'
    })
    data.map(async ({id,name, full_name, owner:{login}={}}={})=>{
        const {data: contributors=[]} = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
            owner: login,
            repo: name
        });
        const {data: teams=[]} = await octokit.request('GET /repos/{owner}/{repo}/teams', {
            owner: login,
            repo: name
        });
        console.log(JSON.stringify(
            {
                id,
                full_name,
                contributors: contributors.map(d=>d.login),
                teams: teams.map(d=>d.name)
            },
            null,2
        ));
    })
}

main();