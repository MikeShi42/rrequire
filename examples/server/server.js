// server.js
function add(x, y) {
  console.log('x', x, 'y', y);
  return x + y;
}

function divide(x, y) {
  return x / y;
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

function createPerson(foo) {
  return new Person(foo);
}

// require('@rrequire/server').start({ port: 3000, enableCors: true });
require('@rrequire/server').export({
  divide,
  add,
  log,
  createPerson,
});
