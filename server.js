const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var data = require('quick.db');
var utils = require('./utils.js');
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;

const DEFAULT_PIC = 'https://cdn.glitch.com/51abc91e-1207-4d19-94aa-de472d3c1d5a%2Fpersonal_default_avatar_for_mobile_phone_app__146524.png?1539975465839';

const options = {
  maxAge: 1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 15, 
  httpOnly: true
}

app.use(express.static('public'));
app.use(cookieParser());
var jsonParser = bodyParser.json();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/enter', (req, res) => {
  res.sendFile(__dirname + '/views/enter.html');
});

/* ENTERING */

app.post("/register", jsonParser, function (req, res) {
  if(!req.body || !req.body.name || !req.body.surname || !req.body.email || !req.body.password) return res.sendStatus(400);
    
  var email   = req.body.email,
      pass    = req.body.password,
      name    = req.body.name,
      surname = req.body.surname;
  
  var user = data.get(email);
  
  if (user) return res.sendStatus(403);
  
  data.set(`${email}`, {password: pass, name: name, surname: surname, pic: DEFAULT_PIC});
  
  // Set cookie
  res.cookie('login', email + '|' + pass, options);
  res.json('');
});

app.post("/login", jsonParser, function (req, res) {
  if(!req.body || !req.body.email || !req.body.password) return res.sendStatus(400);
    
  var email = req.body.email,
      pass  = req.body.password;
  
  var user = data.get(email);
  
  if (!user) return res.sendStatus(404);
  if (user.password !== pass) return res.sendStatus(403);

  // Set cookie
  res.cookie('login', email + '|' + pass, options);
  res.json('');
});

/* SOCKET.IO */

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
