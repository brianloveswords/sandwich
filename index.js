var Places = require('./places');
var Stream = require('stream');
var util = require('util');
var async = require('async');

function Multipick(set) {
  if (!(this instanceof Multipick))
    return new Multipick(set);
  this._seperator = '\n';
  this._format = set.map(function () {
    return '%s';
  }).join(',');
  this.processInput(set);
}
util.inherits(Multipick, Stream)

Multipick.prototype.processInput = function processInput(set) {
  this._set = set;

  if (Array.isArray(set[0]))
    return this.beginEmitting();

  async.map(set, processStream, function (err, results) {
    if (err) throw err;
    this._set = results;
    return this.beginEmitting();
  }.bind(this));
};

function processStream(stream, callback) {
  var buffer = Buffer(0);
  var result;
  stream.on('data', function (buf) {
    buffer = Buffer.concat([buffer, buf]);
  }).once('end', function () {
    result = buffer.toString().trim().split('\n');
    callback(null, result);
  }).once('error', function (err) {
    callback(err);
  });
}

/**
 * Start emitting `data` events. You shouldn't have to call this manually
 */

Multipick.prototype.beginEmitting = function beginEmitting() {
  this.emit('begin');
  process.nextTick(function () {
    var maximums = this.calculateMaximums();
    var places = new Places(maximums);
    do
      this.emit('data', this.output(places.value));
    while (places.inc());
    return this.emit('end');
  }.bind(this));
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
  var collection, element, elementIndex;
  for (var i = 0; i < data.length; i++) {
    collection = data[i];
    elementIndex = indices[i];
    element = collection[elementIndex];
    result[i] = element;
    if (elementIndex >= collection.length || typeof element === 'undefined')
      return null;
  }
  return result;
};

/**
 * Randomize the datasets.
 *
 * @return {this}
 */

Multipick.prototype.randomize = function randomize() {
  var data = this._set;
  for (var i = 0; i < data.length; i++)
    data[i].sort(shuffle);
  return this;
};

function shuffle() { return coin(); }
function coin() { return Math.round(Math.random()); }

module.exports = function multipick(set) {
  return new Multipick(set);
};
