var test = require('tap').test;
var Places = require('../places');

test('generic places testing', function (t) {
  var places = new Places([1, 2, 3]);
  t.same(places.value, [0, 0, 0]);
  t.same(places.next(), [1, 0, 0]);
  t.end();
});

test('generic places testing, overflow', function (t) {
  var places = new Places([1, 2, 3]);
  places.value = [1, 0, 0]
  t.same(places.next(), [0, 1, 0]);
  t.same(places.next(), [1, 1, 0]);
  t.same(places.next(), [0, 2, 0]);
  t.same(places.next(), [1, 2, 0]);
  t.same(places.next(), [0, 0, 1]);
  t.same(places.next(), [1, 0, 1]);
  t.same(places.next(), [0, 1, 1]);
  t.same(places.next(), [1, 1, 1]);
  t.same(places.next(), [0, 2, 1]);
  t.same(places.next(), [1, 2, 1]);
  t.same(places.next(), [0, 0, 2]);
  t.same(places.next(), [1, 0, 2]);
  t.same(places.next(), [0, 1, 2]);
  t.same(places.next(), [1, 1, 2]);
  t.same(places.next(), [0, 2, 2]);
  t.same(places.next(), [1, 2, 2]);
  t.same(places.next(), [0, 0, 3]);
  t.same(places.next(), [1, 0, 3]);
  t.same(places.next(), [0, 1, 3]);
  t.same(places.next(), [1, 1, 3]);
  t.same(places.next(), [0, 2, 3]);
  t.same(places.next(), [1, 2, 3]);
  t.same(places.next(), null);
  t.same(places.value, [1, 2, 3]);
  t.end();
});

test('places#maxedOut', function (t) {
  var places = new Places([1, 2, 3]);
  places.value = [0, 2, 3];
  t.notOk(places.maxedOut(), 'should not be maxed out');
  places.value = [1, 2, 3];
  t.ok(places.maxedOut(), 'should be maxed out');
  t.end();
});
