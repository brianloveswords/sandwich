var phrasegen = require('..');
var test = require('tap').test;

test('generating too many phrases', function (t) {
  var generator = phrasegen({
    adjectives: ['d', 'e', 'f'],
    nouns: ['a']
  });
  var phrases = [
    generator.next(),
    generator.next(),
    generator.next()
  ];

  try {
    generator.next();
    t.fail('should not be able to generate a new phrase');
  } catch (err) {
    t.ok(err, 'should have an error');
  }
  t.end();
});

test('ensure uniqueness', function (t) {
  var generator = phrasegen({
    adjectives: ['d', 'e', 'f'],
    nouns: ['a']
  });
  var phrases = [ generator.next(), generator.next(), generator.next() ];
  phrases.reduce(function (found, phrase) {
    if (found[phrase]) {
      t.fail('should not have more than one of the same phrase');
    }
    found[phrase] = phrase;
    return found;
  }, {});

  t.end();
});

test('generating many at once', function (t) {
  var generator = phrasegen({
    adjectives: ['a'],
    nouns: ['a', 'b', 'c']
  });
  var phrases = generator.many(3).sort();
  var expect = ['a-a', 'a-b', 'a-c'];
  t.same(phrases, expect);
  t.end();
});

test('generating all of the phrases', function (t) {
  var generator = phrasegen({
    adjectives: ['a'],
    nouns: ['a', 'b', 'c']
  });
  // blow through all of them
  var expect = [
    generator.next(),
    generator.next(),
    generator.next()
  ].sort();

  // this should still generate all of the phrases...
  var phrases = generator.all().sort();
  t.same(expect, phrases);

  // ...but doing one more `next` should throw an exception
  try {
    generator.next();
    t.fail('should be exhausted');
  } catch (err) {
    t.ok(err, 'should have had `exhausted` error');
  }
  t.end();
});
