// Express Module
const express = require('express')

// Router Module
const router = express.Router()

// Authorization
const { Authorization  } = require('../../utils')

// Verify Access Token
router.use(Authorization.verifyAccessToken)

// Verify If the current user isLoggedIn 
router.use(Authorization.isLoggedIn)

// Import Controllers
const { JobControllers } = require('../controllers')

// Route Definition
router.route('/')

        // Create Project 
        .post(JobControllers.addJob)

// Check Job Status Route
router.get('/start-processor', JobControllers.startJobProcessor)

// Export Router
module.exports = router