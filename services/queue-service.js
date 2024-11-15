// Load node modules
// =============================================================
const { Queue, Worker } = require("bullmq");
const { createClient } = require("redis");

// Load services
// =============================================================
const IAMService = require("./iam-service");

// Redis configuration
// =============================================================
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

// Test Redis connection
async function testRedisConnection() {
  const client = createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  });

  try {
    await client.connect();
    console.log("Connected to Redis server successfully.");
  } catch (error) {
    console.error("Failed to connect to Redis server:", error.message);
    throw new Error("Redis connection failed. Please ensure Redis is running.");
  } finally {
    await client.disconnect();
  }
}

(async () => {
  try {
    await testRedisConnection();
  } catch (error) {
    console.error("Exiting due to Redis connection issues.");
    process.exit(1);
  }
})();

// Create a new queue
let queue;
try {
  queue = new Queue("queue", {
    connection: redisConfig,
  });
} catch (error) {
  console.error("Error creating queue:", error.message);
  throw error;
}

// Add job to queue
const addJobToQueue = async (queueName, jobName, data) => {
  try {
    const queue = new Queue(queueName, { connection: redisConfig });
    await queue.add(jobName, data);
  } catch (error) {
    console.error(`Failed to add job ${jobName} to the queue:`, error.message);
    throw error;
  }
};

// Mapping of job names to service methods
const jobServiceMapping = {
  fetchIdentities: IAMService.listIdentities,
  fetchRoles: IAMService.listRoles,
  fetchGroups: IAMService.listGroups,
  fetchPolicies: IAMService.listPolicies,
};

// Worker to process jobs
let worker;
try {
  worker = new Worker(
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
} catch (error) {
  console.error("Error initializing worker:", error.message);
  throw error;
}

module.exports = {
  addJobToQueue,
};
