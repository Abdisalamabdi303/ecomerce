// Ensure global webcrypto is available (needed by some dependencies at runtime)
import { webcrypto as nodeWebcrypto } from 'node:crypto';
// @ts-ignore - augment global at runtime
if (!(globalThis as any).crypto) {
    (globalThis as any).crypto = nodeWebcrypto;
}

import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .catch(err => {
        console.log(err);
    });
