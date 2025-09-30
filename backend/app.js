const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const rateLimit = require('express-rate-limit');
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const institutionRoutes = require("./routes/institution.routes");
const branchRoutes = require("./routes/branch.routes");
const courseRoutes = require("./routes/course.routes");
const enquiriesRoutes = require("./routes/enquiries.routes");
const profileRoutes = require("./routes/profile.routes");
const notificationRoutes = require("./routes/notification.routes");
const {
  publicRouter: paymentPublicRoutes,
  protectedRouter: paymentProtectedRoutes,
} = require("./routes/payment.routes");
const {
  couponAdminRoute: adminRoute,
  couponInstitutionAdminRoute: InstitutionAdminRoute,
} = require("./routes/coupon.routes");
const authorizeRoles = require("./middleware/role.middleware");

const googleRoutes = require('./routes/google.routes');

// import global auth middleware
const globalAuthMiddleware = require("./middleware/globalAuth.middleware");

const studentRoutes = require("./routes/students/students.routes"); 

const app = express();

app.use(helmet());
const pinoMiddleware = pinoHttp({ logger: logger });
app.use(pinoMiddleware);

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// The limiter middleware has been commented out as requested.
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: 'Too many requests from this IP, please try again after 15 minutes',
// });
// app.use('/api', limiter);

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/auth", authRoutes);
app.use("/auth/google", googleRoutes);
app.use("/api/v1/payment/", paymentPublicRoutes);

// Apply Global Auth Middleware (for all routes below this line)
app.use(globalAuthMiddleware);

const requireInstituteAdmin = [authorizeRoles(["INSTITUTE_ADMIN"])];
const requireAdmin = [authorizeRoles(["ADMIN"])];
const requireStudent = [authorizeRoles(["STUDENT"])];

app.use("/api/v1/students", studentRoutes, requireStudent); 

app.use("/api/v1/payment", requireInstituteAdmin, paymentProtectedRoutes);
app.use("/api/v1/admin/coupon", requireAdmin, adminRoute);
app.use("/api/v1/coupon", requireInstituteAdmin, InstitutionAdminRoute);

app.use("/api/v1/", profileRoutes);

app.use("/api/v1/enquiries", enquiriesRoutes);

app.use("/api/v1/institutions", requireInstituteAdmin, institutionRoutes);

app.use(
  "/api/v1/institutions/:institutionId/branches",
  requireInstituteAdmin,
  branchRoutes
);
app.use(
  "/api/v1/institutions/:institutionId/courses",
  requireInstituteAdmin,
  courseRoutes
);

app.use("/api/v1/notifications", notificationRoutes);

app.get("/health", (req, res) => res.status(200).send("OK"));


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
  req.log.error(err, "An unhandled error occured");
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "An internal server error occured." : err.message;

  res.status(statusCode).json({
    status: "error",
    message:
      err.isOperational || process.env.NODE_ENV !== "production"
        ? err.message
        : "Something went very wrong!",
  });

});

module.exports = app;