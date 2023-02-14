#!/usr/bin/env node

const { spawn } = require('child_process');

const args = process.argv.slice(2);

console.log(`Running on Node.js ${process.version}.`);

const match = /v(\d+)/.exec(process.version);

const needsOpenSslLegacyProvider = match && match[1] > 16;

needsOpenSslLegacyProvider && console.warn('Setting --openssl-legacy-provider to support Node.js v17+.');

const child = spawn('cross-env',
  needsOpenSslLegacyProvider ? ['NODE_OPTIONS=--openssl-legacy-provider', ...args] : args, {
    shell: true,
    stdio: 'inherit'
  }
);

child.on('exit', function (code) {
  process.exit(code)
})
