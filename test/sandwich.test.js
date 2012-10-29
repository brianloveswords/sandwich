var sandwich = require('..');
var test = require('tap').test;
var pathutil = require('path');
var fs = require('fs');

const adjectiveFile = pathutil.join(__dirname, '../assets/adjectives.txt');
const nounFile = pathutil.join(__dirname, '../assets/nouns.txt');

test('sandwicher#pick: returns stuff', function (t) {
  var picker = new sandwich([['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']]);
  var result = picker.pick([0, 1, 2, 3]);
  var expect = ['a','b','c','d'];
  t.same(result, expect);
  t.end();
});

test('sandwicher#pick: returns false when any index is out of bounds', function (t) {
  var picker = new sandwich([['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']]);
  var result = picker.pick([0, 1, 2, 9]);
  var expect = null;
  t.same(result, expect);
  t.end();
});

test('sandwich#next', function (t) {
  var picker = new sandwich([
    ['a', '1'],
    ['b', '2'],
    ['c', '3'],
  ]);
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
  var result = sandwich([
    ['a', '1', 'alpha'],
    ['b', '2', 'beta',],
    ['c', '3', 'gamma'],
  ]).possibilities;
  var expect = 27;
  t.same(result, expect, 'should get the right amount of possibilities');
  t.end();
});
