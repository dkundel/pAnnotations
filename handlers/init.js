(function init_handlers_module (exports) {
  exports.echo = function echo_handler (socket, data) {
    socket.emit('echo', data);
    console.log('echoed', data);
  };
})(exports);