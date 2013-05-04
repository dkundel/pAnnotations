
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/presenter', routes.present);
app.get('/viewer', routes.view);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server, {log: false});

var handlers_root = './handlers';
var handler_paths = [
  handlers_root + '/init.js',
  handlers_root + '/comments.js',
  handlers_root + '/control_prezi.js',
  handlers_root + '/chat.js'
];

var handlers = {
  __init: []  // all init functions from each handler module are stored here
};
handler_paths.forEach(function load_handlers (path) {
  var handler_file = require(path);
  // check for __init functions and queue them
  if (handler_file.__init) {
    handlers.__init.push(handler_file.__init);
    delete handler_file.__init;
  }
  // save handlers
  for (var name in handler_file) {
    if (handlers[name]) {
      throw 'Duplicate handler name';
    }
    handlers[name] = handler_file[name];
  }
});

io.sockets.on('connection', function (socket) {
  var exclude = [ // which handler names to exclude from binding
    '__init'
  ];
  // run __init functions 
  handlers.__init.forEach(function init_handler_modules (callback) {
    callback(socket);
  });

  // register handlers to the socket
  for (var name in handlers) {
    if (exclude.indexOf(name) > -1) {
      continue;
    }
    socket.on(name, 
      (function handler_wrapper (handler_name) {
        return function (data) {
          handlers[handler_name](socket, data);
        }
      })(name)
    );
  }
});
