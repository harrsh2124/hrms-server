import { Prisma, PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
    ],
});

prisma.$on('query', (e: Prisma.QueryEvent) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
});
