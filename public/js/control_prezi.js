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

    socket.on('getSlidePresenter', function(data) {
      var dataOut = {};
      var idx = PC.Prezi.getCurrentStep();
      dataOut.idx = idx;
      socket.emit('moveSlide', dataOut);
    });
  };

  PC.initListener = function _initListener ($Prezi) {
    PC.init($Prezi);
    socket.on('updateSlide', function(data) {
      PC.Prezi.toStep(data.idx);
    });
    PC.Prezi.on(PreziPlayer.EVENT_STATUS, function(args){
      if (args.value == PreziPlayer.STATUS_CONTENT_READY) {
        socket.emit('getSlide');
      }
    });
  };

  exports.PreziControl = PC;
})(window);