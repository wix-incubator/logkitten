#!/usr/bin/env node

const { logkitten } = require('../build');

(async () => {
  const emitter = logkitten({ platform: 'ios' });

  emitter.on('entry', (entry) => {
    if (!entry.subsystem.startsWith('com.facebook.react')) {
      return; // Filter out non-ReactNative entries
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
