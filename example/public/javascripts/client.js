$(function () {
  "use strict";
  var socket = io.connect();
  socket.on('connect', onOpenWebSocket);
  socket.on('stdout', function (message) {
    appendOutput(message);
  });
  socket.on('disconnect', onCloseWebSocket);

  var code = $('#code');
  var stdout = $('#stdout');
  var INITIAL_CODE =
    '(\n' +
    '// analog bubbles\n' +
    '{\n' +
    '	f = LFSaw.kr(0.4, 0, 24, LFSaw.kr([8,7.23], 0, 3, 80)).midicps; // glissando function\n' +
    '	CombN.ar(SinOsc.ar(f, 0, 0.04), 0.2, 0.2, 4) // echoing sine wave\n' +
    '}.play)\n';
  code.text(INITIAL_CODE);

  function onOpenWebSocket() {
    $('#start_server').bind('click', onStartServerClick);
    $('#stop_server').bind('click', onStopServerClick);
    $('#evaluate').bind('click', onEvaluateClick);
    $('#stop_sound').bind('click', onStopSoundClick);
    $('#toggle_recording').bind('click', onToggleRecording);
    $('#restart_interpreter').bind('click', onRestartInterpreter);
    $('#clear_output').bind('click', onClearOutputClick);
    appendOutput('WebSocket connected' + '\n');
  }

  function onCloseWebSocket() {
    $('#start_server').unbind('click', onStartServerClick);
    $('#stop_server').unbind('click', onStopServerClick);
    $('#evaluate').unbind('click', onEvaluateClick);
    $('#stop_sound').unbind('click', onStopSoundClick);
    $('#toggle_recording').unbind('click', onToggleRecording);
    $('#restart_interpreter').unbind('click', onRestartInterpreter);
    appendOutput('WebSocket disconnected');
  }

  function onStartServerClick() {
    socket.emit('start_server');
  }

  function onStopServerClick() {
    socket.emit('stop_server');
  }

  function onEvaluateClick() {
    var text = code.val();
    if (!text) {
      return;
    }
    socket.emit('evaluate', text);
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
    setOutput(stdout.val() + msg);
  }

  function setOutput(msg) {
    stdout.text(msg);
    stdout.attr('scrollTop', stdout.attr('scrollHeight'));
  }
});
