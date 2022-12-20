// Auth Controllers
const AuthControllers = require('./auth.controllers')

// Api Controllers
const ApiControllers = require('./api.controllers')

// App Controllers
const AppControllers = require('./app.controllers')

// Job Controllers
const JobControllers = require('./job.controllers')

// Service Controllers
const ServiceControllers = require('./service.controllers')

//User Controllers
const UserControllers = require('./user.controllers')

// Export Controllers
module.exports = {
    AuthControllers,
    ApiControllers,
    AppControllers,
    JobControllers,
    ServiceControllers,
    UserControllers
}