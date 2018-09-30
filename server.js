const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var db = require('quick.db');
var utils = require('./utils.js');
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cookieParser());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', (req, res) => {
  
  res.sendFile(__dirname + '/views/register.html');
});

app.get('/register/submit', (req, res) => {
  var email= req.query.email,
      pass = req.query.password;
  var id = utils.random(1000000, 9999999);
  
  db.set(id, {email: email, password: pass}).then(a => console.log(a));

  let options = {
    maxAge: 1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 15, 
    httpOnly: true
  }

  // Set cookie
  res.cookie('id', id, options) // options is optional
  res.redirect("/");
});

io.on('connection', socket => {
  
  // Emit new connection
  io.emit('new_connection');
  
  // On message
  socket.on('chat_message', msg => {
    io.emit('chat_message', msg);
  });
  
  // On typing
  socket.on('chat_typing', user => {
    io.emit('chat_typing', user);
  });
  
  socket.on('disconnect', (reason) => {
    // Emit disconnect
    io.emit('disconnect', reason);
  });
  
});

http.listen(port, () => {
  console.log('> [LOG] Listening on port', port);
});
