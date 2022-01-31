const output = require("./output")
const fs = require("fs");

function parser() {
    let people = [];
    let teamList = [];

    output.forEach(({collaborators = [], teams = []}) => {
        collaborators.forEach(({name}) => {
            if (people.indexOf(name) === -1) {
                people.push(name)
            }
        })
        teams.forEach(d => {
            if (teamList.indexOf(d) === -1) {
                teamList.push(d)
            }
        })
    })

    let HEADER = `id,name`;
    people.forEach(d => HEADER = `${HEADER},${d}`);
    teamList.forEach(d => HEADER = `${HEADER},${d}`);

    let CSV = `${HEADER}\n`;

    function getCollabStatus(collaborators = [], user = "") {
        for (let i = 0; i < collaborators.length; i++) {
            if (collaborators[i] && collaborators[i].name === user) {
                return collaborators[i].admin ? "ADMIN" : "USER";
            }
        }
        return "NULL"
    }

    function getTeamStatus(teams = [], team) {
        return teams.indexOf(team) > -1 ? "YES" : "NO"
    }

    output.forEach(({id, full_name, collaborators = [], teams = []}) => {
        let line = `${id},"${full_name}"`
        people.forEach(d => line = `${line},${getCollabStatus(collaborators, d)}`);
        teamList.forEach(d => line = `${line},${getTeamStatus(teams, d)}`);
        CSV = `${CSV}${line}\n`;
    })
    fs.writeFileSync("output.csv", CSV);
}
if(require.main === module) {
    parser()
} else{
    module.exports = {parser}
}

