// Ensure global webcrypto is available (needed by some dependencies at runtime)
import { webcrypto as nodeWebcrypto } from 'node:crypto';
// @ts-ignore - augment global at runtime
if (!(globalThis as any).crypto) {
    (globalThis as any).crypto = nodeWebcrypto;
}

import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
