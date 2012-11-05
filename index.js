var Places = require('./places');

function Sandwich(datasets) {
  this.initialize(datasets);
};


Sandwich.prototype.initialize = function initialize(datasets) {
  var maximums;
  this.nextable = true;
  this.maximums = maximums = datasets.map(function (set) {
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

Sandwich.prototype.shuffle = function shuffle() {
  var datasets = this._datasets;
  var idx = datasets.length;
  while (idx--)
    datasets[idx].sort(randomize);
  return this;
};

// we want a value between -1 and 1
function randomize() {
  return (Math.random() * 3 | 0) - 1;
}

/**
 * Pick a random thing from set
 *
 * @return {Array} result of random pick
 * @see Sandwich#pick
 */

Sandwich.prototype.random = function random() {
  var randomIndices = this.maximums.map(function (max) {
    return Math.random() * max | 0;
  });
  return this.pick(randomIndices);
};


module.exports = function sandwich(sets) {
  return new Sandwich(sets);
};
