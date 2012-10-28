var Places = require('./places');
var Stream = require('stream');
var util = require('util');

function Multipick(set) {
  if (!(this instanceof Multipick))
    return new Multipick(set);
  this._set = set;
  this._seperator = '\n';
  this._format = set.map(function () {
    return '%s';
  }).join(',');
  process.nextTick(function () {
    this.beginEmitting();
  }.bind(this));
}
util.inherits(Multipick, Stream)

/**
 * Set the separator at the end of the string when emitting events
 *
 * @param {String} str
 * @return {this}
 */

Multipick.prototype.separator = function separator(str) {
  this._seperator = str;
  return this;
};


/**
 * Set the format for the output. Will be passed to `util.format`
 *
 * @param {String} fmt
 * @return {this}
 */

Multipick.prototype.format = function format(fmt) {
  this._format = fmt;
  return this;
};

/**
 * Calculate the maximum amount for each set
 *
 * @return {Array} An array of all the maximum indices for each item in
 *   the set defined in the constructor.
 */

Multipick.prototype.calculateMaximums = function calculateMaximums() {
  var setLen = this._set.length;
  var maximums = [];
  for (var i = 0; i < setLen; i++)
    maximums.push(this._set[i].length - 1);
  return maximums;
};

/**
 * Start emitting `data` events. You shouldn't have to call this manually
 */

Multipick.prototype.beginEmitting = function beginEmitting() {
  var maximums = this.calculateMaximums();
  var places = new Places(maximums);
  do this.emit('data', this.output(places.value));
  while (places.inc());
  return this.emit('end');
};

/**
 * Get the formatted output for an index array
 *
 * @param {Array} indices An array of indices to pull from the datasets
 * @return {String} formatted output
 */

Multipick.prototype.output = function output(indices) {
  var value = this.pick(indices);
  var format = this._format;
  var separator = this._seperator || '';
  var str;
  if (format) {
    str = util.format.bind(util, format).apply(util, value);
    return str + separator;
  }
  return value.toString() + separator;
};

/**
 * Pick a set of elements from the dataset by an array of indices
 *
 * @param {Array} indices The indices of elements to pull from each set
 * @return {Array|Null} Elements from each set or null if any are out
 *   of bounds
 */

Multipick.prototype.pick = function pick(indices) {
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

module.exports = function multipick(set) {
  return new Multipick(set);
};
