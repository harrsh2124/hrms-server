import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import errorhandler from 'errorhandler';
import express, { Application } from 'express';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from '../../env';

export class Express {
    app: Application;

    constructor() {
        this.app = express();
    }

    initializeApp = () => {
        const PORT = env.app.port;

        this.app.use(
            cors({
                origin: env.app.cors.urls,
                methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
            })
        );
        this.app.use(express.json());
        this.app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );
        this.app.use(express.static(env.app.root_dir + '/public'));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.disable('x-powered-by');

        // error handler
        if (env.node !== 'production') {
            // only use in development
            this.app.use(errorhandler());
        }

        this.app.set('port', PORT);
    };

    configureRateLimiter = async () => {
        this.app.use(
            rateLimit({
                // Rate limiter configuration
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: env.app.api_rate_limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
                standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
                legacyHeaders: false, // Disable the `X-RateLimit-*` headers
            })
        );
    };
}
