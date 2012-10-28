var util = require('util');
var Stream = require('stream');
function StreamString() {
  this.writable = true;
  this._value = '';
}; util.inherits(StreamString, Stream);

StreamString.prototype.write = function write(str) {
  this._value += str.toString();
};

StreamString.prototype.end = function end() {
  // don't do anything, I guess
};

StreamString.prototype.value = function value() {
  return this._value;
};

module.exports = StreamString;