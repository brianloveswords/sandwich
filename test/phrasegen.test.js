var multipick = require('..');
var StreamString = require('../streamstring');
var test = require('tap').test;
var fs = require('fs');

test('multipicker.pick: returns stuff', function (t) {
  var picker = new multipick([['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']]);
  var result = picker.pick([0, 1, 2, 3]);
  var expect = ['a','b','c','d'];
  t.same(result, expect);
  t.end();
});

test('multipicker.pick: returns false when any index is out of bounds', function (t) {
  var picker = new multipick([['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd']]);
  var result = picker.pick([0, 1, 2, 9]);
  var expect = null;
  t.same(result, expect);
  t.end();
});

test('piping', function (t) {
  var streamstring = new StreamString();
  var picker = new multipick([
    ['a', '1'],
    ['b', '2'],
    ['c', '3'],
  ]);
  picker.format('%s-%s-%s').pipe(streamstring);
  picker.on('end', function () {
    var expect = 'a-b-c\n1-b-c\na-2-c\n1-2-c\na-b-3\n1-b-3\na-2-3\n1-2-3\n';
    t.same(streamstring.value(), expect);
    t.end();
  });
});