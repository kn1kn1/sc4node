/*!
 * sc4node-sclang
 *
 * Copyright (C) 2011  Kenichi Kanai
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Module dependencies.
 */
var child_process = require('child_process')
  , path = require('path');

/**
 * Sclang constructor.
 *
 * @class a proxy class for sclang
 * @param {String} pathSclang path to sclang
 * @param {Function(Buffer)} handler stdout handler
 * @api public
 */
var Sclang = module.exports = function (pathSclang, handler) {
  if (!(this instanceof Sclang)) {
    return new Sclang(pathSclang, handler);
  }
  this.init(pathSclang, handler);
};

/**
 * Start sclang process and initialize instance.
 *
 * @param {String} pathSclang path to sclang
 * @param {Function(Buffer)} handler stdout handler
 * @api private
 */
Sclang.prototype.init = function (pathSclang, handler) {
  var sclang = path.join(pathSclang, 'sclang');
  if (!path.existsSync(sclang)) {
    throw new Error(sclang + ' not found.');
  }

  this._path = pathSclang;
  this._process = child_process.spawn(sclang, ['-i', 'sc4node', '-d', pathSclang]);
  if (handler) {
    this._handler = handler;
    this._process.stdout.on('data', handler);
  }
  this._recording = false;
};

/**
 * Start scsynth default server.
 *
 * @api public
 */
Sclang.prototype.startServer = function () {
  this.evaluate('Server.default.boot;', false);
};

/**
 * Stop scsynth default server.
 *
 * @api public
 */
Sclang.prototype.stopServer = function () {
  this.evaluate('Server.default.quit;', false);
};

/**
 * Evaluate code.
 * 
 * @param {String} code code 
 * @param {Boolean} silent silent
 * @api public
 */
Sclang.prototype.evaluate = function (code, silent) {
  if (!code) {
    return;
  }
  this._process.stdin.write(code);
  if (silent) {
    this._process.stdin.write('\x1b');
  } else {
    this._process.stdin.write('\x0c');
  }
};

/**
 * Stop sound.
 *
 * @api public
 */
Sclang.prototype.stopSound = function () {
  this.evaluate('thisProcess.stop;', false);
};

/**
 * Start/Stop recording.
 *
 * @api public
 */
Sclang.prototype.toggleRecording = function () {
  if (this._recording) {
    this.evaluate('s.stopRecording;', true);
    this._recording = false;
  } else {
    this.evaluate('s.prepareForRecord;', true);
    setTimeout(function () {
      this.evaluate('s.record;', true);
    }.bind(this), 100);
    this._recording = true;
  }
};

/**
 * Dispose instance.
 *
 * @api public
 */
Sclang.prototype.dispose = function () {
  this.stopServer();
  setTimeout(function (p) {
    p.stdin.end();
    p.kill();
  }, 100, this._process);
};

/**
 * Restart sclang process.
 *
 * @api public
 */
Sclang.prototype.restart = function () {
  this.dispose();
  this.init(this._path, this._handler);
};
