const { Queue, Worker } = require('bullmq');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const Subscription = require('../models/Subscription');

const QUEUE_NAME = 'subscription-queue';
const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || ''
};

// --- QUEUE ---
const subscriptionQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

async function scheduleDailyChecks() {
  await subscriptionQueue.add('check-expirations', {}, {
    repeat: { cron: '0 1 * * *', tz: 'Asia/Kolkata' },
    jobId: 'daily-expiration-check',
  });
  logger.info('Daily subscription check has been scheduled.');
}

// --- WORKER ---
const createWorker = () => {
  // Ensure DB is connected for this standalone process
  mongoose.connect(process.env.MONGO_URI).then(() => logger.info('MongoDB connected for subscription worker.'));

  new Worker(QUEUE_NAME, async (job) => {
    if (job.name === 'check-expirations') {
      logger.info('Running daily check for expired subscriptions...');
      const expired = await Subscription.updateMany(
        { status: 'active', endDate: { $lte: new Date() } },
        { $set: { status: 'expired' } }
      );
      if (expired.modifiedCount > 0) {
        logger.info(`Successfully marked ${expired.modifiedCount} subscriptions as expired.`);
      } else {
        logger.info('No subscriptions to expire today.');
      }
    }
  }, { connection: redisConnection });
};

if (require.main === module) {
  logger.info('Subscription worker started.');
  createWorker();
  scheduleDailyChecks();
}