// Load node modules
// =============================================================
const { Queue, Worker } = require("bullmq");

// Load services
// =============================================================
const IAMService = require("./iam-service");

// Redis configuration
// =============================================================
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

// Create a new queue
const queue = new Queue("queue", {
  connection: redisConfig,
});

// Add job to queue
const addJobToQueue = async (queueName, jobName, data) => {
  const queue = new Queue(queueName, { connection: redisConfig });
  await queue.add(jobName, data);
};

// Mapping of job names to service methods
const jobServiceMapping = {
  fetchIdentities: IAMService.listIdentities,
  fetchRoles: IAMService.listRoles,
  fetchGroups: IAMService.listGroups,
  fetchPolicies: IAMService.listPolicies,
};

// Worker to process jobs
const worker = new Worker(
  "queue",
  async (job) => {
    console.log(`Processing job ${job.id} of ${job.name}`);

    const serviceFunction = jobServiceMapping[job.name];

    if (serviceFunction) {
      try {
        const result = await serviceFunction();
        console.log(`Fetched data:`, result);
      } catch (error) {
        console.error(`Error processing job ${job.name}:`, error);
      }
    } else {
      console.warn(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection: redisConfig,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});

module.exports = {
  addJobToQueue,
};
