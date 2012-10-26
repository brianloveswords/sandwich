const fs = require('fs');
const nounFile = 'assets/nouns.txt';
const adjectivesFile = 'assets/adjectives.txt';

function loadIntoArray(file) {
  var buf = fs.readFileSync(file);
  return buf.toString().trim().split('\n')
}

function randomElement(array) {
  var length = array.length;
  return array[Math.random() * length | 0];
}

function makePhrase(options) {
  const nouns = options.nouns;
  const adjectives = options.adjectives;
  return [adjective, noun].join('-')
}

var prototype = {};
prototype.phrase = function phrase() {
  const adjective = randomElement(this.adjectives);
  const noun = randomElement(this.nouns);
  return [adjective, noun].join('-');
}

prototype.next = function next() {
  var phrase;
  if (this.generated >= this.limit)
    throw new Error('Unique phrases exhausted.');

  do phrase = this.phrase();
  while (this.found[phrase]);

  this.generated++;
  return this.found[phrase] = phrase;
};

prototype.reset = function reset() {
  this.generated = 0;
  this.found = {};
};

prototype.many = function many(n) {
  var phrases = [];
  while (n-- && n >= 0)
    phrases.push(this.next());
  return phrases;
};

prototype.all = function all() {
  var phrases;
  var cache = {
    generated: this.generated,
    found: this.found
  };
  this.reset();
  phrases = this.many(this.limit);
  this.generated = cache.generated;
  this.found = cache.found;
  return phrases;
};

module.exports = function phrasegen(options) {
  options = options || {};
  const adjectives = options.adjectives || loadIntoArray(adjectivesFile);
  const nouns = options.nouns || loadIntoArray(nounFile);
  var generator = Object.create(prototype, {
    nouns:      { value: nouns },
    adjectives: { value: adjectives },
    limit:      { value: adjectives.length * nouns.length },
    generated:  { value: 0,  writable: true },
    found:      { value: {}, writable: true }
  });
  return generator;
};