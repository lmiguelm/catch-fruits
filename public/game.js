
const game = {

  state: {
    players: {},
    fruits: {
      fruit1: {
        x: 10,
        y: 11
      }
    },
    screen: {
      height: 100,
      width: 100,
    },
    currentPlayer: ''
  },

  addPlayer(command) {

    const playerId = command.playerId;

    game.state.players[playerId] = {
      x:  Math.floor(Math.random() * game.state.screen.width),
      y:  Math.floor(Math.random() * game.state.screen.height),
      score: 0
    }
    return game.state.players
  },

  disconnectPlayer(playerId) {
    delete game.state.players[playerId];
    return game.state.players;
  },

  render(screen, state) {
    const context = screen.getContext('2d');
    context.fillStyle = 'white';
    context.clearRect(0, 0, game.state.screen.width, game.state.screen.height);

    for(const playerId in state.players) {
      const player = state.players[playerId]

      if(playerId == game.state.currentPlayer) {
        context.fillStyle = 'black'
      } else {
        context.fillStyle = '#888'
      }
      context.fillRect(player.x, player.y, 1, 1);
    }

    for(const fruitId in state.fruits) {
      const player = state.fruits[fruitId]
      context.fillStyle = '#912'
      context.fillRect(player.x, player.y, 1, 1);
    }
  },


  keyboardListener(event) {
    const colision = game.movePlayer(event.key);
    return colision; 
  },


  movePlayer(keypressed) {

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
            player.y = player.y - 1
        }
      },
      ArrowRight(player) {
          if (player.x + 1 < game.state.screen.width) {
              player.x = player.x + 1
          }
      },
      ArrowDown(player) {
          if (player.y + 1 < game.state.screen.height) {
              player.y = player.y + 1
          }
      },
      ArrowLeft(player) {
          if (player.x - 1 >= 0) {
              player.x = player.x - 1
          }
      }
    }

    const moveFunction = acceptedMoves[keypressed]

    if(moveFunction) {
      moveFunction(game.state.players[game.state.currentPlayer]);
      const colision = game.checkColision();
      return colision;
    }
    game.render(document.getElementById('game'), game.state);
  },

  checkColision() {
    const player = game.state.players[game.state.currentPlayer];
    const fruit = game.state.fruits["fruit1"];
    
    if(player.x == fruit.x && player.y == fruit.y) {
      player.score += 1;
      game.renderScore();
      game.audio();

      return true;
    }
    return false;
  },

  async audio() {
    const file = `./assets/audios/success.mp3?cb=${new Date().getTime()}`;
    const audio = new Audio(file);
    audio.load();
    await audio.play()
  },

  renderScore() {

    var scoreContainer = document.getElementById('score-container');
    scoreContainer.innerText = '';

    for(const playerId in game.state.players ) {

      let p = game.state.players[playerId];

      let tr = document.createElement('tr');
      
      if(playerId == game.state.currentPlayer) {
        tr.style.color = '#daa520';
      }

      let player = document.createElement('td');
      player.innerText = playerId
      let score = document.createElement('td');
      score.innerText = p.score

      tr.appendChild(player);
      tr.appendChild(score);
  
      scoreContainer.appendChild(tr);
    };
  }
}

export default game;
