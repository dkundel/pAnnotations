(function (exports){
  var PC = {};
  var socket = exports.socket;

  PC.init = function _init ($Prezi) {
    var id = $Prezi.attr('id');
    var preziId = $Prezi.attr('data-prezi');
    PC.Prezi = new PreziPlayer(id, {preziId: preziId});
  };

  PC.initPresenter = function _initPresenter ($Prezi) {
    PC.init($Prezi);
    PC.Prezi.on(PreziPlayer.EVENT_CURRENT_STEP, function(args){
      var data = {};
      data.idx = args.value;
      socket.emit('moveSlide', data);
    });

    socket.on('getSlide', function(data) {
      var dataOut = {};
      dataOut.idx = PC.Prezi.getStep();
      socket.emit('updateSlide', dataOut);
    });
  };

  Prezi.initListener = function _initListener ($Prezi) {
    PC.init($Prezi);
    socket.emit('getSlide');
    socket.on('updateSlide', function(data) {
      PC.Prezi.toStep(data.idx);
    });
  };

  exports.PreziControl = PC;
})(window);