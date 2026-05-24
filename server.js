/**
 * Compatibility shim. `npm start` (and the old `node server.js` muscle memory)
 * still work, but the canonical entry point is now ./server/index.js.
 * To be removed in a future phase once all docs/scripts reference the new path.
 */
require('./server/index.js');
