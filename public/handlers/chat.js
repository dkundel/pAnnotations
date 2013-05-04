(function chat_handlers_module (handlers) {

  handlers.chat = on_chat;

  handlers.chat_load = function on_chat_load (socket, data) {
    for (var i=0; i<data.messages.length; ++i) {
      on_chat(socket, data.messages[i]);
    }
  };

  window.chat = function chat (message) {
    socket.emit('chat', {
      id: Math.floor(Math.random() * 10000),
      message: message
    });
  }

  function on_chat (socket, data) {
    console.info('['+data.timestamp+'] '+data.id+': '+data.message);
  };

})(window.socket_handlers);