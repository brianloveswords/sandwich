# sandwich [![Build Status](https://secure.travis-ci.org/brianloveswords/sandwich.png)](http://travis-ci.org/brianloveswords/sandwich)

Iterator generator getting ordered combinations of items.

# install

```js
$ npm install sandwich
```

# example

```js
const sandwich = require('sandwich');
const adverbs = ['very'];
const adjectives = ['woeful', 'lethargic', 'blissful'];
const animals = ['sloth', 'bear', 'hawk'];
const iter = sandwich(adverbs, adjectives, animals);

iter.next(); // [ 'very', 'woeful', 'sloth' ]
iter.next(); // [ 'very', 'lethargic', 'sloth' ]
iter.next(); // [ 'very', 'blissful', 'sloth' ]
iter.next(); // [ 'very', 'woeful', 'bear' ]
iter.next(); // [ 'very', 'lethargic', 'bear' ]
iter.next(); // [ 'very', 'blissful', 'bear' ]
iter.next(); // [ 'very', 'woeful', 'hawk' ]
iter.next(); // [ 'very', 'lethargic', 'hawk' ]
iter.next(); // [ 'very', 'blissful', 'hawk' ]
iter.next(); // null

iter.random(); // [ 'very', 'lethargic', 'sloth' ]
iter.random(); // [ 'very', 'woeful', 'sloth' ]
iter.random(); // [ 'very', 'lethargic', 'bear' ]
iter.random(); // [ 'very', 'woeful', 'bear' ]
```

# License

MIT/X11
