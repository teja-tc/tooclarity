const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');

const authRoutes = require('./routes/auth.routes');
const institutionRoutes = require('./routes/institution.routes');
const branchRoutes = require('./routes/branch.routes');
const courseRoutes = require('./routes/course.routes');

const app = express();

app.use(helmet());
const pinoMiddleware = pinoHttp({ logger: logger });
app.use(pinoMiddleware);

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// The limiter middleware has been commented out as requested.
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: 'Too many requests from this IP, please try again after 15 minutes',
// });
// app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/institutions', institutionRoutes);

app.use('/api/v1/institutions/:institutionId/branches', branchRoutes);
app.use('/api/v1/institutions/:institutionId/courses', courseRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use((err, req, res, next) => {
    req.log.error(err, 'An unhandled error occured');
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'An internal server error occured.' : err.message;

    res.status(err.statusCode).json({
        status: 'error',
        message: (err.isOperational || process.env.NODE_ENV !== 'production') ? err.message : 'Something went very wrong!',
    });
});

module.exports = app;