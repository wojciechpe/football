function Game(team1, team2, roundNumber) {
  this.roundNumber = roundNumber ? roundNumber : null;
  this.team1 = team1 ? team1 : null;
  this.team2 = team2 ? team2 : null;
}

Game.prototype.reverseTeams = function() {
  var temp = this.team2;
  this.team2 = this.team1;
  this.team1 = temp;
}