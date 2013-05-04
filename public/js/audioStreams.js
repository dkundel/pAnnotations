(function (exports){    

  var apiKey = "28173072";
  var sessionId = "2_MX4yODE3MzA3Mn4xMjcuMC4wLjF-U2F0IE1heSAwNCAwNTo1OTozMiBQRFQgMjAxM34wLjMxNDc1NDM3fg";
  var token = "T1==cGFydG5lcl9pZD0yODE3MzA3MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz02Y2I3NDlkZTM1ZTY2OWFlZTY4NzM4M2Q5ZmM0NjUyZTQyYjA1ODE5OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9JmNyZWF0ZV90aW1lPTEzNjc2NzIzNzImbm9uY2U9MC4yMTI5MzMzMjU3ODI4NTUxOCZleHBpcmVfdGltZT0xMzY3NzU4NzcyJmNvbm5lY3Rpb25fZGF0YT0=";

  var publishDiv = 'stream';

  // Initialize session, set up event listeners, and connect
  var session = TB.initSession(sessionId);

  exports.streaming = {};

  exports.streaming.initServer = function(){
    session.addEventListener('sessionConnected', exports.streaming.serverConnectedHandler);
    session.connect(apiKey, token);
          
  }

  exports.streaming.initClient = function(){
    session.addEventListener('sessionConnected', exports.streaming.clientConnectedHandler);
    session.connect(apiKey, token);
          
  }

  exports.streaming.serverConnectedHandler = function(event) {
    var publisher = TB.initPublisher(apiKey, 'myPublisherDiv');
    //var sub = TB.initSubscriber(apiKey, 'mySubDiv');
    session.publish(publisher);
    //session.subscribe(sub);
  }

  exports.streaming.clientConnectHandler = function(){

    if(event.streams[0])
      session.subscribe( event.streams[0], 'mySubDiv');
  }

  $(function(){

    if(window.presenter)
      exports.streaming.initServer();
    else
      exports.streaming.initClient();
  });
})(window);
