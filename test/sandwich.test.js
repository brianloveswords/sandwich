var sandwich = require('..');
var test = require('tap').test;
var pathutil = require('path');
var fs = require('fs');
var deepEqual = require('deep-equal');

const adjectiveFile = pathutil.join(__dirname, '../assets/adjectives.txt');
const nounFile = pathutil.join(__dirname, '../assets/nouns.txt');

test('sandwicher#pick: returns stuff', function (t) {
  var picker = sandwich(['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']);
  var result = picker.pick([0, 1, 2, 3]);
  var expect = ['a','b','c','d'];
  t.same(result, expect);
  t.end();
});

test('sandwicher#pick: returns false when any index is out of bounds', function (t) {
  var picker = sandwich(['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']);
  var result = picker.pick([0, 1, 2, 9]);
  var expect = null;
  t.same(result, expect);
  t.end();
});

test('sandwich#next', function (t) {
  var picker = sandwich(
    ['a', '1'],
    ['b', '2'],
    ['c', '3']
  );
  t.same(picker.next(), ['a', 'b', 'c']);
  t.same(picker.next(), ['1', 'b', 'c']);
  t.same(picker.next(), ['a', '2', 'c']);
  t.same(picker.next(), ['1', '2', 'c']);
  t.same(picker.next(), ['a', 'b', '3']);
  t.same(picker.next(), ['1', 'b', '3']);
  t.same(picker.next(), ['a', '2', '3']);
  t.same(picker.next(), ['1', '2', '3']);
  t.end();
});

test('sandwich#possibilities', function (t) {
  var result = sandwich(
    ['a', '1', 'alpha'],
    ['b', '2', 'beta',],
    ['c', '3', 'gamma']
  ).possibilities;
  var expect = 27;
  t.same(result, expect, 'should get the right amount of possibilities');
  t.end();
});

test('sandwich#random', function (t) {
  function fileToArray(file) {
    return fs.readFileSync(__dirname + '/../assets/' + file)
      .toString()
      .trim()
      .split('\n')
  }
  var adverbs = fileToArray('adverbs.txt');
  var adjectives = fileToArray('adjectives.txt');
  var nouns = fileToArray('nouns.txt');
  var iter = sandwich(adverbs, adjectives, nouns);

  var random, ordered;
  var results = [];
  var times = 10;

  // testing something that's non-deterministic is hard -- this test
  // can fail if the random pick, by chance, picks the same as what
  // would be next. There are > 300 million options with the data set
  // we're using so hopefully that's enough to make the chance of that
  // happening very slim.
  while (times--) {
    random = iter.random().join('-');
    ordered = iter.next().join('-');
    results.push(random !== ordered);
  }
  t.ok(results.reduce(function (v, r) {
    if (v) return v;
    else return r;
  }, false), 'at least one should be random');

  t.end();
});

test('sandwich#random, coverage', function (t) {
  var first = [ 'woeful', 'sloth' ];
  var last = [ 'blissful', 'hawk' ];
  var foundFirst = false;
  var foundLast = false;
  var adjectives = ['woeful', 'lethargic', 'blissful'];
  var animals = ['sloth', 'bear', 'hawk'];
  var iter = sandwich(adjectives, animals);
  var times = 1000;
  while (times--) {
    foundFirst = foundFirst || deepEqual(iter.random(), first);
    foundLast = foundLast || deepEqual(iter.random(), last);
  }
  t.ok(foundFirst, 'should have found first');
  t.ok(foundLast, 'should have found last');
  t.end();
});


test('sandwich initialize, throw early on bad input', function (t) {
  try {
    var iter = sandwich('bad stuff', 'yep');
    t.fail('should fail early');
  } catch (err) {
    t.same(err.name, 'TypeError', 'should be a type error');
  }
  t.end();
});
