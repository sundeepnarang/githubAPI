const {Octokit} = require("@octokit/core");
const {personalAccessToken} = require("./config");
const fs = require("fs");

const octokit = new Octokit({ auth: personalAccessToken });

async function fetch(page="1") {
    const {data} = await octokit.request('GET /orgs/{org}/repos', {
        org: 'qualityedgar',
        per_page: '100',
        page: page
    })
    const unresolvedPromises = data.map(async ({id,name, full_name, owner:{login}={}}={})=>{
        const {data: collaborators=[]} = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
            owner: login,
            repo: name
        });
        const {data: teams=[]} = await octokit.request('GET /repos/{owner}/{repo}/teams', {
            owner: login,
            repo: name
        });
        return {
            id,
            full_name,
            collaborators: collaborators.map(d=>{return { name: d.login, admin: d.permissions.admin }}),
            teams: teams.map(d=>d.name)
        }
    })

    const results = await Promise.all(unresolvedPromises);
    return results;
}

async  function main(){
    const pg1 = await fetch();
    const pg2 = await fetch("2");
    fs.writeFileSync("output.js", `module.exports = ${JSON.stringify(pg1.concat(pg2),null, 2)}`)
}


main().then(r => console.log("done"));