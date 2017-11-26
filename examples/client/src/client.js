// client.js
import rrequire, { config } from '@rrequire/client';

config({ remoteLocation: 'http://localhost:8080' });

const { add, log, divide } = rrequire('server');

(async function main() {
  log(await add(40, 2));
  log(await divide(12, 2));
})();
