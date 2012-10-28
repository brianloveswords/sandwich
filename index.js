var Places = require('./places');
var Stream = require('stream');
var util = require('util');

function multipick(set) {
  this._set = set;
  this._seperator = '\n';
  this._format = set.map(function () {
    return '%s';
  }).join(',');
  process.nextTick(function () {
    this.go();
  }.bind(this));
}
util.inherits(multipick, Stream)

multipick.prototype.separator = function separator(chr) {
  this._seperator = chr;
  return this;
};

multipick.prototype.format = function format(fmt) {
  this._format = fmt;
  return this;
};

multipick.prototype.go = function go() {
  var setLen = this._set.length;
  var maximums = [];
  var places;
  for (var i = 0; i < setLen; i++)
    maximums.push(this._set[i].length - 1);
  places = new Places(maximums);
  do {
    this.emit('data', this.output(places.value));
  } while (places.inc());
  return this.emit('end');
};

multipick.prototype.output = function output(indices) {
  var value = this.pickOne(indices);
  var format = this._format;
  var separator = this._seperator || '';
  var str;
  if (format) {
    str = util.format.bind(util, format).apply(util, value);
    return str + separator;
  }
  return value.toString() + separator;
};

multipick.prototype.pickOne = function pickOne(indices) {
  var data = this._set;
  var result = [];
  var element, idx;
  for (var i = 0; i < data.length; i++) {
    idx = indices[i];
    element = data[i][idx];
    result[i] = element;
    if (idx >= data.length || typeof element === 'undefined')
      return null;
  }
  return result;
};

module.exports = multipick;
