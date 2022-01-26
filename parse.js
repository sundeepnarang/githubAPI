const output = require("./output")
const fs = require("fs");
const {people, teamList} = require("./config");

const HEADER = `id,name,${people[0]},${people[1]},${people[2]},${people[3]},${people[4]},${teamList[0]},${teamList[1]},${teamList[2]},${teamList[3]}\n`
let CSV = HEADER;

function getCollabStatus(collaborators=[], user=""){
    for(let i =0;i<collaborators.length;i++){
        if(collaborators[i] && collaborators[i].name===user){
            return collaborators[i].admin ? "ADMIN" : "USER";
        }
    }
    return "NULL"
}

function getTeamStatus(teams=[],team){
    return teams.indexOf(team)>0?"YES":"NO"
}

output.forEach(({id, full_name,collaborators=[], teams=[]})=>{
    const line = `${id},"${full_name}",${getCollabStatus(collaborators,people[0])},`+
        `${getCollabStatus(collaborators, people[1])},${getCollabStatus(collaborators,people[2])},`+
        `${getCollabStatus(collaborators,people[3])},${getCollabStatus(collaborators,people[4])},`+
        `${getTeamStatus(teams, teamList[0])},${getTeamStatus(teams, teamList[1])},`+
        `${getTeamStatus(teams, teamList[2])},${getTeamStatus(teams, teamList[3])}\n`
    CSV = CSV+line;
})
fs.writeFileSync("output.csv",CSV);
