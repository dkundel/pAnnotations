(function init_handlers_module (exports) {
  exports.__init = function init () {
    console.log('WARNING: demo init model successfully initialized :)');
  }
  exports.echo = function echo_handler (socket, data) {
    socket.emit('echo', data);
    console.log('echoed', data);
  };
})(exports);