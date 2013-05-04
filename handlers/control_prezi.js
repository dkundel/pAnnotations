(function control_prezi (exports) {
  exports.moveSlide = function move_slide_handler (socket, data) {
    socket.broadcast.emit('updateSlide', data);
  };
  exports.getSlide = function get_slide_handler (socket, data) {
    socket.broadcast.emit('getSlidePresenter', {});
  };
})(exports);