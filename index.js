var Places = require('./places');

function Sandwich(datasets) {
  this.nextable = true;
  this.processDataset(datasets);
};

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
 * Pretend we have a real iterator.
 */

Sandwich.prototype.next = function next() {
  if (!this.nextable)
    return null;

  var indices, value;
  indices = this._indices;
  value = this.pick(indices.value);
  this.nextable = indices.next();
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
