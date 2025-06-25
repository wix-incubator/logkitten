#!/usr/bin/env node

const { logkitten } = require('../build');

(async () => {
  const emitter = logkitten({ platform: 'android' });

  emitter.on('entry', (entry) => {
    if (!entry.tag.startsWith('ReactNative')) {
      return;
    }

    console.log({ ...entry, ts: new Date(entry.ts) });
  });

  emitter.on('error', (error) => {
    console.error('Logging error:', error.message);
  });

  process.on('SIGINT', async () => {
    await emitter.close();
    process.exit(0);
  });
})();
