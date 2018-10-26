$(document).ready(function() {

  // Init socket
  var socket = io();

  var form = $('form');
  var mInput = $('#m');
  var typingBox = $('.typing');
  var sendBtn = $('#send');

  // On submitting form emit chat_message event
  sendBtn.click(() => {
    mInput.focus();

    // Return if no message
    if (mInput.val().trim() === "" || mInput.val() === undefined) {
      mInput.addClass("invalid");
      setTimeout(() => {
        mInput.removeClass('invalid');
      }, 1000);
      return false;
    }

    socket.emit('chat_message', $('#m').val().trim());
    $('#m').val('');

    return false;
  });

  // On typing emit chat_typing
  var previousState = mInput.val();
  var nextState;
  var typingState = false;

  mInput.keyup(() => {
    nextState = mInput.val();

    if (nextState !== previousState && typingState === false) {
      typingBox.removeClass('hidden');
      socket.emit('chat_typing', $('#m').val());
      previousState = nextState;
      typingState = true;
    }
  });

  // On chat_message event update messages
  socket.on('chat_message', function(msg) {
    $('#messages').append(
      $('<li class="animated fadeIn">')
      .html(
        '<img class="ava" src="https://cdn.glitch.com/51abc91e-1207-4d19-94aa-de472d3c1d5a%2Fpersonal_default_avatar_for_mobile_phone_app__146524.png?1539975465839">'+
        '<div class="m-box"><a href="' + "/" + '" class="m-box-author">Anonymous</a><div class="m-box-msg">' + msg + '</div></div>'
      ));
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Notify on new connection
  socket.on('new_connection', () => {
    $('#messages').append($('<li class="animated fadeIn blue white-text">').text("New user connected"));
  });

  // Notify on disconnect
  socket.on('disconnect', (reason) => {
    $('#messages').append($('<li class="animated fadeIn red white-text">').html("User disconnected by reason: <b>" + reason + "</b>"));
  });

  // Notify when typing
  socket.on('chat_typing', () => {
    typingBox.removeClass('hidden');
    setTimeout(() => {
      typingBox.addClass('hidden');
      typingState = false;
    }, 2500);
  });

});