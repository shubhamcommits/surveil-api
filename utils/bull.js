// Apply Environments
if (process.env.NODE_ENV != 'production') {

    // DotEnv Module
    const dotenv = require('dotenv')

    // Load the config from the .env file
    dotenv.config()

}

// Import Queue from bull
const Queue = require('bull');

// Job Queue
const jobQueue = new Queue('jobQueue',
    {
        redis: {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD
        }
    })

// Console the job Queue
console.log('Job Queue has been initiated!')

// Export Module
module.exports = jobQueue