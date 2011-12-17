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

/**
 * Sclang constructor.
 *
 * @param {String} path to sclang
 * @param {Function} stdout handler
 * @api public
 */
var Sclang = module.exports = function(path, handler) {
    this.init(path, handler);
};

/**
 * Start sclang process and initialize instance.
 *
 * @api private
 */
Sclang.prototype.init = function(path, handler) {
    this._path = path;
    this._process = child_process.spawn(path + 'sclang', ['-d', path]);
    if (handler) {
      this._handler = handler;
      this._process.stdout.on('data', handler);
    }
    this._recording = false;
}

/**
 * Start scsynth default server.
 *
 * @api private
 */
Sclang.prototype.startServer = function() {
    this.evaluate('Server.default.boot;', false);
};

/**
 * Stop scsynth default server.
 *
 * @api private
 */
Sclang.prototype.stopServer = function() {
    this.evaluate('Server.default.quit;', false);
}

/**
 * Evaluate code.
 * 
 * @param {String} code
 * @param {Boolean} silent
 * @api public
 */
Sclang.prototype.evaluate = function(code, silent) {
    evaluate(this._process, code, silent);
};

/**
 * Stop sound.
 *
 * @api public
 */
Sclang.prototype.stopSound = function() {
    this.evaluate('thisProcess.stop;', false);
}

/**
 * Start/Stop recording.
 *
 * @api public
 */
Sclang.prototype.toggleRecording = function() {
    if (this._recording) {
        this.evaluate('s.stopRecording;', true);
        this._recording = false;
    } else {
        this.evaluate('s.prepareForRecord;', true);
        var _p = this._process;
        setTimeout(function() {
           evaluate(_p, 's.record;', true);
        }, 100);
        this._recording = true;
    }
}

/**
 * Dispose instance.
 *
 * @api public
 */
Sclang.prototype.dispose = function() {
    this.stopServer();
    var _p = this._process;
    setTimeout(function() {
        _p.stdin.end();
        _p.kill();
    }, 100);
}

/**
 * Restart sclang process.
 *
 * @api public
 */
Sclang.prototype.restart = function() {
    this.dispose();
    this.init(this._path, this._handler);
}

function evaluate(sclang, code, silent) {
    console.log('evaluate: ' + code);
    if (!code || code == '') return;
    sclang.stdin.write(code);
    if (silent) {
        sclang.stdin.write('\x1b');
    } else {
        sclang.stdin.write('\x0c');
    }
}