// client.js
import rrequire from './clientRrequire';

const { add, log, doMagic, duh } = rrequire('server');
// 
// duh(999);
//
// add(1, 2).then(result => {
//   console.log(result);
//   log('client added 1+2=' + result);
// });

(async function() {
  console.log(await doMagic('foo'))
  log(await add(1,2));
})();
