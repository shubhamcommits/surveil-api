// Import Models
const { Auth, User } = require('../models')

// Password Module
const { Password } = require('../../utils')

// JWT Module
const jwt = require('jsonwebtoken')

// Moment Module
const moment = require('moment')

// Authentication Service
const AuthService = {
    /**
     * This function is responsible for creating the Authentication logs
     * @param {*} token 
     * @param {*} userId 
     * @returns 
     */
    async createAuthLog(token, userId, requestIpAddress) {
        return new Promise(async (resolve, reject) => {
            try {

                // Authentication logs schema
                const authLog = {
                    token: token,
                    _user: userId,
                    ip_address: requestIpAddress || null
                }

                // Create the auth logs
                const auth = await Auth.create(authLog)

                // Resolve the promise
                resolve(auth)

            } catch (error) {

                // Catch the error and reject the promise
                reject({ error: error })
            }
        })
    },

    /**
     * This function is responsible for signing out the user
     * @param {*} userId 
     * @param {*} token 
     * @returns 
     */
    async signOut(userId, token) {
        return new Promise(async (resolve, reject) => {
            try {
                await Auth.findOneAndUpdate({
                    _user: userId,
                    token: token
                }, {
                    $set: {
                        logged_in: false,
                        last_logout: moment().format()
                    }
                }, {
                    new: true
                })

                // Resolve the promise
                resolve({
                    message: "Logged out, successfully!"
                })

            } catch (error) {

                // Catch the error and reject the promise
                reject({ error: error })
            }
        })
    },

    /**
     * This function is responsible for activating/deactivating the user
     * @param {*} userId 
     * @returns 
     */
    async changeActiveStatus(userId, active) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.findOneAndUpdate({
                    _id: userId
                }, {
                    $set: {
                        active: active
                    }
                }, {
                    new: true
                })

                // Resolve the promise
                resolve({
                    message: "User's active status changed successfully!",
                    user: user
                })

            } catch (error) {

                // Catch the error and reject the promise
                reject({ error: error })
            }
        })
    },

    /**
     * This function is responsible for signing in the user
     * @param {*} email 
     * @param {*} password 
     * @returns 
     */
    async signIn(email, password, requestIpAddress) {
        return new Promise(async (resolve, reject) => {
            try {

                // Check if user exists in the DB 
                const user = await User.findOne({ email })

                // If user wasn't found or user was previously removed/disabled, return error
                if (!user || user.active === false) {
                    reject({ error: 'Either user doesn\'t exist or was disabled from the system.' })
                }

                // Decrypt the Password
                const decryptedPassword = await Password.decryptPassword(password, user.password)

                // If the password is wrong
                if (!decryptedPassword.password) {
                    reject({ error: 'Please enter a valid email or password!' })
                }

                // Create the signed token
                const token = jwt.sign(user.toJSON(), process.env.JWT_ACCESS_KEY, {
                    expiresIn: process.env.JWT_ACCESS_TIME
                })

                // Log the auths
                this.createAuthLog(token, user._id, requestIpAddress)

                // Resolve the promise
                resolve({
                    user: user,
                    token: token
                })

            } catch (error) {

                console.error(error)

                // Catch the error and reject the promise
                reject(error)
            }
        })
    },

    /**
     * This function is responsible for signing up the user
     * @param {*} userData 
     * @returns 
     */
    async signUp(userData) {
        return new Promise(async (resolve, reject) => {
            try {


                // Check if user exists in the DB 
                const checkUserEmail = await User.findOne({ email: userData.email })

                if (checkUserEmail) {
                    reject({ error: 'User with this email already exist.' })
                }

                // Encrypting user password
                const encryptedPass = await Password.encryptPassword(userData.password)

                // If the password is wrong
                if (!encryptedPass.password) {
                    reject({ error: 'Please choose a different password.' })
                }

                // User Data
                let data = {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    full_name: userData.first_name + userData.last_name,
                    email: userData.email,
                    type: userData.type || 'user',
                    password: encryptedPass.password
                }

                // Create the new User
                let user = await User.create(data)

                // If user is not created
                if (!user) {
                    reject({ error: 'User was not created.' })
                }

                // Resolve the promise
                resolve({
                    user: user
                })

            } catch (error) {

                // Catch the error and reject the promise
                reject({ error: error })
            }
        })
    }
}

// Export Service
module.exports = AuthService