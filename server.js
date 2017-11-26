// server.js
function add(x, y) {
  console.log('x', x, 'y', y);
  return x + y;
}

function log(tag) {
  console.log('log', tag);
}

class Person {
  constructor(a) {
    this.x = 1;
    this.y = 2;
    this.z = a;
  }
}

function doMagic(foo, bar) {
  return new Person(foo);
}

require('./server2');

require('./serverRrequire').export({
    add,
    log,
    doMagic,
});
