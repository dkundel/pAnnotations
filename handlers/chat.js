(function chat_handlers_module (handlers) {

  var messages = [];

  handlers.__init = function init (socket) {
    socket.emit('chat_load', {
      messages: messages
    });
  };

  handlers.chat = function on_chat (socket, data) {
    var defaults = {
      id: messages.length,
      user_id: 'no-user-id',
      photo: '/img/no-photo.jpg',
      name: 'Anonymous',
      message: '(no message)'
    };    
    var new_message = {};
    new_message.user = data.user;
    for (var key in defaults) {
      new_message[key] = data[key] !== undefined ? data[key] : defaults[key];
    }
    new_message.timestamp = (new Date()).getTime();
    messages.push(new_message);
    socket.broadcast.emit('chat', new_message);
    socket.emit('chat', new_message);
  };

})(exports);
