const { Queue, Worker } = require('bullmq');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const InstituteAdmin = require('../models/InstituteAdmin');
require('dotenv').config({ path: `../.env.development` });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected in worker!");
  } catch (err) {
    console.error("❌ MongoDB connection error in worker:", err.message);
    process.exit(1);
  }
})();

const QUEUE_NAME = 'wishlist-processing';

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};

const wishlistQueue = new Queue(QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 10000 },
        removeOnComplete: true,
        removeOnFail: { count: 1000 },
    }
});

/**
 * Adds a job to the wishlist queue.
 * @param {string} userId - The ID of the user (who must be a student).
 * @param {string} courseId - The ID of the course to add.
 */
exports.addCourseToWishlistJob = async (userId, courseId) => {
  await wishlistQueue.add('add-course', { userId, courseId });
};

const createWishlistWorker = () => {
  logger.info(`Starting wishlist worker for queue: ${QUEUE_NAME}`);
  new Worker(QUEUE_NAME, async (job) => {
    const { userId, courseId } = job.data;
    logger.info(`Processing job ${job.id}: Add course ${courseId} to wishlist for user ${userId}`);

    try {
        const result = await InstituteAdmin.updateOne(
            { _id: userId, role: 'STUDENT' },
            { $addToSet: { wishlist: courseId } }
        );

        if (result.matchedCount === 0) {
            logger.error(`Job ${job.id} failed: User ${userId} not found or is not a student.`);
            await job.moveToFailed({ message: 'User is not a student or does not exist.' }, true);
            return;
        }

        if (result.modifiedCount === 0) {
            logger.warn(`Job ${job.id}: Course ${courseId} was already in wishlist for user ${userId}.`);
        } else {
            logger.info(`Job ${job.id}: Successfully added course ${courseId} to wishlist for user ${userId}.`);
        }
    } catch (error) {
        logger.error(`Job ${job.id} failed for user ${userId}: ${error.message}`);
        throw error;
    }
  }, {
    connection: redisConnection,
    concurrency: 10,
    limiter: { max: 20, duration: 1000 },
  });
};

if (require.main === module) {
  createWishlistWorker();
}

exports.createWishlistWorker = createWishlistWorker;