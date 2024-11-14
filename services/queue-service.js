// Load node modules
// =============================================================
const Queue = require("bull");
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

// Create a new queue instance with a configurable name
function createQueue(queueName) {
  return new Queue(queueName, { redis: redisConfig });
}

// Function to create and manage a queue
function createQueueService(queueName, jobHandlers = {}) {
  const queue = createQueue(queueName);

  // Function to add a job to the queue
  function addJob(jobName, data) {
    return queue.add(jobName, data);
  }

  // Process jobs in the queue
  queue.process(async (job) => {
    try {
      console.log(`Processing job ${job.id} of type ${job.name}`);
      if (jobHandlers[job.name]) {
        // Call the appropriate handler if it exists
        await jobHandlers[job.name](job.data);
      } else {
        console.warn(`No handler found for job type: ${job.name}`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error; // Rethrow the error to retry the job if necessary
    }
  });

  // Handle job completion
  queue.on("completed", (job, result) => {
    console.log(`Job completed: ${job.id}`);
  });

  // Handle job failure
  queue.on("failed", (job, err) => {
    console.error(`Job failed: ${job.id}`, err);
  });

  return {
    addJob,
  };
}

module.exports = createQueueService;
