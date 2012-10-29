var Places = require('./places');
var Stream = require('stream');
var util = require('util');

function Sandwich(datasets) {
  if (!(this instanceof Sandwich))
    return new Sandwich(datasets);
  this.nextable = true;
  this.separator('\n');
  this.format(datasets.map(identity('%s')).join(','));
  this.processDataset(datasets);
}; util.inherits(Sandwich, Stream)

function identity(value) {
  return function () { return value };
}

/**
 * Stub, just in case we want to handle different types of inputs.
 */

Sandwich.prototype.processDataset = function processDataset(datasets) {
  var maximums;
  maximums = datasets.map(function (set) {
    return set.length - 1;
  });
  this.possibilities = maximums.reduce(function (product, value) {
    return product * (value + 1);
  }, 1);
  this._datasets = datasets;
  this._indices = new Places(maximums);
};

/**
 * Override `pipe` inherited from Stream
 */
Sandwich.prototype.pipe = function pipe(endpoint) {
  this.beginEmitting();
  return Stream.prototype.pipe.call(this, endpoint);
};

/**
 * Start emitting `data` events. You shouldn't have to call this manually
 */

Sandwich.prototype.beginEmitting = function beginEmitting() {
  process.nextTick(function () {
    var value;
    while ((value = this.next()))
      this.emit('data', this.formatOutput(value));
    return this.emit('end');
  }.bind(this));
  return this;
};


/**
 * Get the formatted output for an index array
 *
 * @param {Array} value Array of values to format
 * @return {String} formatted output
 */

Sandwich.prototype.formatOutput = function formatOutput(value) {
  var format = this.format();
  var separator = this.separator() || '';
  var str;
  if (format) {
    str = util.format.bind(util, format).apply(util, value);
    return str + separator;
  }
  return value.toString() + separator;
};

/**
 * Set the format for the output. Will be passed to `util.format`
 */
Sandwich.prototype.format = accessor('_format');


/**
 * Set the separator at the end of the string when emitting events
 */
Sandwich.prototype.separator = accessor('_separator');

function accessor(key) {
  return function (value) {
    if (arguments.length > 0) {
      this[key] = value;
      return this;
    }
    return this[key];
  }
}

/**
 * Pick a set of elements from the dataset by an array of indices
 *
 * @param {Array} indices The indices of elements to pull from each set
 * @return {Array|Null} Elements from each set or null if any are out
 *   of bounds
 */

Sandwich.prototype.pick = function pick(indices) {
  var data = this._datasets;
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
 * Pretend we have a real generator.
 */

Sandwich.prototype.next = function next() {
  if (!this.nextable)
    return null;

  var indices, value;
  indices = this._indices;
  value = this.pick(indices.value);
  this.nextable = indices.inc();
  return value;
};

/**
 * Randomize the datasets.
 *
 * @return {this}
 */

Sandwich.prototype.randomize = function randomize() {
  var data = this._datasets;
  for (var i = 0; i < data.length; i++)
    data[i].sort(shuffle);
  return this;
};

function shuffle() { return coin(); }
function coin() { return Math.round(Math.random()); }

module.exports = function sandwich(dataset) {
  return new Sandwich(dataset);
};
