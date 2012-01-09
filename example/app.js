
/**
 * Module dependencies.
 */

var express = require('express')
  , sio = require('socket.io')
  , routes = require('./routes')
  , Sclang = require('../lib/sc4node/sclang')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Socket IO
var io = sio.listen(app);
io.sockets.on('connection', function(socket) {
  console.log('connection');
    
  var sclang = new Sclang('/Applications/SuperCollider/', function (data) {
    console.log('sclang stdout: ' + data);
    socket.emit('stdout', '' + data);
  });
  
  socket.on('start_server', function(message) {
    console.log('start_server');
    sclang.startServer();
  });
  
  socket.on('stop_server', function(message) {
    console.log('stop_server');
    sclang.stopServer();
  });
  
  socket.on('evaluate', function(message) {
    console.log('evaluate: ' + message);
    sclang.evaluate('' + message, false);
  });
  
  socket.on('stop_sound', function(message) {
    console.log('stop_sound');
    sclang.stopSound();
  });
  
  socket.on('toggle_recording', function(message) {
    console.log('toggle_recording');
    sclang.toggleRecording();
  });
  
  socket.on('restart_interpreter', function(message) {
    console.log('restart_interpreter');
    sclang.restart();
  });
  
  socket.on('disconnect', function() {
    console.log('disconnect');
    sclang.dispose();
  });
});