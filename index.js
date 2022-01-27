class Team {
    constructor (name) {
        this.name = name;
        this.players = [];
    }

    addPlayer(name, position) {
        this.positions.push(new Player(name, position));
    }
}

class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position;
    }
}

// on line 21 go to crudcrud.com and insert a new endpoint address between api/ and /team
class TeamService {
    static url ='https://crudcrud.com/api/9dd8ec6fbc934a7699dc0a060d24d623/team';

    static getAllTeams() {
        return $.get(this.url);
    }

    static getTeam(id) {
        return $.get(this.url + `/${id}`);
    }

    static createTeam(team) {
        return $.post({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            crossDomain: true,
        });
    }

    static updateTeam(team) {
        const id= team._id;
        delete team._id;
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            crossDomain: true,
            type: 'PUT'
        });
    }

    static deleteTeam(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static teams;

    static getAllTeams() {
        TeamService.getAllTeams().then(teams => this.render(teams));
    }

    static render(teams) {
        this.teams = teams;
        $('#app').empty();
        for (let team of teams) {
            $('#app').prepend(
                `<div id="${team._id}" class="card">
                    <div class="card-header">
                        <h2>${team.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${team._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${team._id}-player-name" class="form-control" placeholder="Player Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${team._id}-player-position" class="form-control" placeholder="Player Position">
                                </div>
                            </div>
                            <button id="${team._id}-new-player" onclick="DOMManager.addPlayer('${team._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            console.log(team);
            for(let player of team.players) {
                console.log(player);
                const a =  `<p>
                <span id="name-${player.name}"><strong>Name: </strong> ${player.name}</span>
                <span id="position-${player.position}"><strong>Position: </strong> ${player.position}</span>
                <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${team._id}', '${player._id}')">Delete Player</button>`
                console.log(a);
                const e =  $(`#${team._id}`).find('.card-body');
                console.log(e);
                $(`#${team._id}`).find('.card-body').append(a);
            }
        }
    }

    static createTeam(name) {
        TeamService.createTeam(new Team(name))
            .then(() => {
                return TeamService.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static deleteTeam(id) {
        TeamService.deleteTeam(id)
            .then(() => {
                return TeamService.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static addPlayer(id) {
        for (let team of this.teams) {
            if(team._id ==id) {
                team.players.push(new Player($(`#${team._id}-player-name`).val(), $(`#${team._id}-player-position`).val()));
                TeamService.updateTeam(team)
                    .then(()=> {
                        return TeamService.getAllTeams();
                    })
                    .then((teams) => this.render(teams));
            }
        }
    }

    static deletePlayer(teamId, playerId) {
        for(let team of this.teams) {
            if(team._id == teamId) {
                for(let player of team.players) {
                    if(player._id == playerId) {
                        team.players.splice(team.players.indexOf(player), 1);
                        TeamService.updateTeam(team)
                            .then(() => {
                                return TeamService.getAllTeams();
                            })
                            .then((teams) => this.render(teams));
                    }
                }
            }
        }
    }

    
}

$('#create-new-team').click(() => {
    DOMManager.createTeam($('#new-team-name').val());
    $('#new-team-name').val('');
});
DOMManager.getAllTeams();