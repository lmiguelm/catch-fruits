import express from 'express';
const app = express();

import http from 'http';
const server = http.createServer(app);

import cors from 'cors';
app.use(cors());

import socketio from 'socket.io';
const io = socketio(server);

import game from './public/game';

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
});

io.on('connection', socket => {

  const playerId = socket.id;
  socket.emit('connection', playerId);

  const players = game.addPlayer({ playerId });
  io.emit('new-player', players);

  socket.on('disconnect', () => {
    const players = game.disconnectPlayer(playerId);
    io.emit('disconnect-player', players);
  });

  socket.on('move-player', player => {
    io.emit('move-player', { ...player, playerId } );
  });

  socket.on('colision', () => {
    const fruit = {
      x: Math.floor(Math.random() * game.state.screen.width),
      y: Math.floor(Math.random() * game.state.screen.height),
    }
    io.emit('move-fruit', fruit );
  });

}); 



server.listen(3333);