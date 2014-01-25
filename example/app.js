


/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var sio = require('socket.io');
var sc = require('../lib/sc4node');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Socket IO
var io = sio.listen(server);
io.sockets.on('connection', function(socket) {
  console.log('connection');
    
  var sclang = sc.start('/Applications/SuperCollider/SuperCollider.app/Contents/Resources/', function(data) {
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