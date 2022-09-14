import dotenv from 'dotenv';

import { getOsEnv, normalizePort, toNumber } from './libs/env';

dotenv.config();

/**
 * Environment variables
 */
export const env = {
    node: getOsEnv('APP_ENV'),

    app: {
        port: normalizePort(getOsEnv('APP_PORT')) || getOsEnv('APP_PORT'),
        api_prefix: getOsEnv('API_PREFIX'),
        api_rate_limit: toNumber(getOsEnv('API_RATE_LIMIT')),
        root_dir: getOsEnv('APP_ENV') === 'production' ? 'dist' : 'src',

        cors: {
            urls: getOsEnv('CORS_AVAILABLE_LINKS').split(','),
        },
    },
};
