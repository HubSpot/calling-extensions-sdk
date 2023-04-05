#!/usr/bin/env node

/**
 * Uses the openssl legacy provider when using Node.js v17 and higher.
 * To learn more, visit: https://nodejs.org/es/blog/release/v17.0.0/#openssl-3-0.
 */

const { spawn } = require('child_process');

const args = process.argv.slice(2);

console.log(`Running on Node.js ${process.version}.`);

const match = /v(\d+)/.exec(process.version);

const needsOpenSslLegacyProvider = match && match[1] > 16;

needsOpenSslLegacyProvider && console.warn('Setting --openssl-legacy-provider to support Node.js v17+.');

if (process.env.NODE_ENV === 'test'){}

const child = spawn('cross-env',
  needsOpenSslLegacyProvider ? ['NODE_OPTIONS=--openssl-legacy-provider', ...args] : args, {
    shell: true,
    stdio: 'inherit'
  }
);

child.on('exit', function (code) {
  process.exit(code)
})
