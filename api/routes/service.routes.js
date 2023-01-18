// Express Module
const express = require('express')

// Router Module
const router = express.Router()

// Authorization
const { Authorization  } = require('../../utils')

// Import Controllers
const { ServiceControllers } = require('../controllers')

// Verify Access Token
router.use(Authorization.verifyAccessToken)

// Verify If the current user isLoggedIn 
router.use(Authorization.isLoggedIn)

// Create Service Route
router.post('/', ServiceControllers.createService)

// Get Services Route
router.get('/', ServiceControllers.getAllUserServices)

// Route Definition
router.route('/:serviceId')

    // Get Service Route
    .get(ServiceControllers.getServiceDetails)

    // Update Service Route
    .put(ServiceControllers.updateService)

    // Remove Service Route
    .delete(ServiceControllers.removeService)

// Export Router
module.exports = router