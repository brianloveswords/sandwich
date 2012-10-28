var multipick = require('..');
var StreamString = require('../streamstring');
var test = require('tap').test;
var pathutil = require('path');
var fs = require('fs');

const adjectiveFile = pathutil.join(__dirname, '../assets/adjectives.txt');
const nounFile = pathutil.join(__dirname, '../assets/nouns.txt');

test('multipicker#pick: returns stuff', function (t) {
  var picker = new multipick([['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']]);
  var result = picker.pick([0, 1, 2, 3]);
  var expect = ['a','b','c','d'];
  t.same(result, expect);
  t.end();
});

test('multipicker#pick: returns false when any index is out of bounds', function (t) {
  var picker = new multipick([['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']]);
  var result = picker.pick([0, 1, 2, 9]);
  var expect = null;
  t.same(result, expect);
  t.end();
});

test('multipick#pipe', function (t) {
  var streamstring = new StreamString();
  var picker = new multipick([
    ['a', '1'],
    ['b', '2'],
    ['c', '3'],
  ]);
  picker.pipe(streamstring);
  picker.on('end', function () {
    var expect = 'a,b,c\n1,b,c\na,2,c\n1,2,c\na,b,3\n1,b,3\na,2,3\n1,2,3\n';
    t.same(streamstring.value(), expect);
    t.end();
  });
});

test('multipick#next', function (t) {
  var picker = new multipick([
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

test('multipick#possibilities', function (t) {
  var result = multipick([
    ['a', '1', 'alpha'],
    ['b', '2', 'beta',],
    ['c', '3', 'gamma'],
  ]).possibilities;
  var expect = 27;
  t.same(result, expect, 'should get the right amount of possibilities');
  t.end();
});
