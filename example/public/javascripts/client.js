// socket.io specific code
var socket = io.connect();
socket.on('connect', onOpenWebSocket);
socket.on('stdout', function(message) {
  appendOutput(message);
});
socket.on('disconnect', onCloseWebSocket);

function onOpenWebSocket() {
  var code = 
'(\n' + 
'// analog bubbles\n' + 
'{\n' + 
'	f = LFSaw.kr(0.4, 0, 24, LFSaw.kr([8,7.23], 0, 3, 80)).midicps; // glissando function\n' +
'	CombN.ar(SinOsc.ar(f, 0, 0.04), 0.2, 0.2, 4) // echoing sine wave\n' + 
'}.play)\n';
  setTextContent($('#code').get(0), code);
  $('#start_server').get(0).addEventListener('click', onStartServerClick, false);
  $('#stop_server').get(0).addEventListener('click', onStopServerClick, false);
  $('#evaluate').get(0).addEventListener('click', onEvaluateClick, false);
  $('#stop_sound').get(0).addEventListener('click', onStopSoundClick, false);
  $('#toggle_recording').get(0).addEventListener('click', onToggleRecording, false);
  $('#restart_interpreter').get(0).addEventListener('click', onRestartInterpreter, false);
  $('#clear_output').get(0).addEventListener('click', onClearOutputClick, false);
  appendOutput('WebSocket connected' + '\n');
}

function onCloseWebSocket() {
  $('#start_server').get(0).removeEventListener('click', onStartServerClick, false);
  $('#stop_server').get(0).removeEventListener('click', onStopServerClick, false);
  $('#evaluate').get(0).removeEventListener('click', onEvaluateClick, false);
  $('#stop_sound').get(0).removeEventListener('click', onStopSoundClick, false);
  $('#toggle_recording').get(0).removeEventListener('click', onToggleRecording, false);
  $('#restart_interpreter').get(0).removeEventListener('click', onRestartInterpreter, false);
  appendOutput('WebSocket disconnected');
}

function onStartServerClick() {
  socket.emit('start_server');
}

function onStopServerClick() {
  socket.emit('stop_server');
}

function onEvaluateClick() {
  var code = $('#code').get(0).value;
  if (code == '') {
   return;
  }
  socket.emit('evaluate', code);
}

function onStopSoundClick() {
  socket.emit('stop_sound');
}

function onToggleRecording() {
  socket.emit('toggle_recording');
}

function onRestartInterpreter() {
  socket.emit('restart_interpreter');
}

function onClearOutputClick() {
  setOutput('');
}

function appendOutput(msg) {
  setOutput($('#stdout').get(0).value + msg);
}

function setOutput(msg) {
  var stdout = $('#stdout').get(0);
  setTextContent(stdout, msg);
  stdout.scrollTop = stdout.scrollHeight;
}

function setTextContent(element, text) {
  while (element.firstChild !== null) {
    element.removeChild(element.firstChild); // remove all existing content
  }
  element.appendChild(document.createTextNode(text));
}

