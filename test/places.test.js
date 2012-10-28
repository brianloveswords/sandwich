var test = require('tap').test;
var Places = require('../places');

test('generic places testing', function (t) {
  var places = new Places([1, 2, 3]);
  t.same(places.value, [0, 0, 0]);
  console.dir(places);
  t.end();
});

test('generic places testing', function (t) {
  var places = new Places([1, 2, 3]);
  places.inc();
  t.same(places.value, [1, 0, 0]);
  t.end();
});

test('generic places testing, overflow', function (t) {
  var places = new Places([1, 2, 3]);
  places.value = [1, 0, 0]
  places.inc();
  t.same(places.value, [0, 1, 0]);
  places.inc();
  t.same(places.value, [1, 1, 0]);
  places.inc();
  t.same(places.value, [0, 2, 0]);
  places.inc();
  t.same(places.value, [1, 2, 0]);
  places.inc();
  t.same(places.value, [0, 0, 1]);
  places.inc();
  t.same(places.value, [1, 0, 1]);
  places.inc();
  t.same(places.value, [0, 1, 1]);
  places.inc();
  t.same(places.value, [1, 1, 1]);
  places.inc();
  t.same(places.value, [0, 2, 1]);
  places.inc();
  t.same(places.value, [1, 2, 1]);
  places.inc();
  t.same(places.value, [0, 0, 2]);
  places.inc();
  t.same(places.value, [1, 0, 2]);
  places.inc();
  t.same(places.value, [0, 1, 2]);
  places.inc();
  t.same(places.value, [1, 1, 2]);
  places.inc();
  t.same(places.value, [0, 2, 2]);
  places.inc();
  t.same(places.value, [1, 2, 2]);
  places.inc();
  t.same(places.value, [0, 0, 3]);
  places.inc();
  t.same(places.value, [1, 0, 3]);
  places.inc();
  t.same(places.value, [0, 1, 3]);
  places.inc();
  t.same(places.value, [1, 1, 3]);
  places.inc();
  t.same(places.value, [0, 2, 3]);
  places.inc();
  t.same(places.value, [1, 2, 3]);
  t.same(places.inc(), false);
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
