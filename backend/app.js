const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const institutionRoutes = require('./routes/institution.routes');
const branchRoutes = require('./routes/branch.routes');
const courseRoutes = require('./routes/course.routes');
const profileRoutes = require('./routes/profile.routes');

// import global auth middleware
const globalAuthMiddleware = require('./middleware/globalAuth.middleware');


const app = express();

app.use(helmet());
const pinoMiddleware = pinoHttp({ logger: logger });
app.use(pinoMiddleware);

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true, 
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/auth', authRoutes);

// 🚨 Apply Global Auth Middleware (for all routes below this line)
app.use(globalAuthMiddleware);

app.use("/api/v1/", profileRoutes)

app.use('/api/v1/institutions', institutionRoutes);

app.use('/api/v1/institutions/:institutionId/branches', branchRoutes);
app.use('/api/v1/institutions/:institutionId/courses', courseRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));


app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(Number(statusCode)).json({
    status: "error",
    message,
  });
});

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