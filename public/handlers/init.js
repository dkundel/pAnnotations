(function init_handlers_module (exports) {
  exports.echo = function echo_handler (socket, data) {
    console.log('echoed', data);
  };
})(window.socket_handlers);