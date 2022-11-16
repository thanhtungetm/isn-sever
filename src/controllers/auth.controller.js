const { validationResult } = require('express-validator')
const authServices = require('../services/auth.service')

async function getUser(req, res, next) {
    try {
        console.log(`GET USER ${req.params.username}`)
        const username = req.params.username
        const userId = req.userId
        res.json(await authServices.getUser(userId, username))
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message)
        next(err)
    }
}
async function searchUsers(req, res, next) {
    try {
        console.log(req.params)
        const username = req.params.username
        const userId = req.userId
        res.json(await authServices.searchUsers(userId, username))
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message)
        next(err)
    }
}
async function login(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        res.json(await authServices.login(req.body))
    } catch (err) {
        console.error(`Error while login`, err.message)
        next(err)
    }
}
async function signup(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        res.json(await authServices.singup(req.body))
        // console.log(req.body);
        // res.json(await authServices.login(req.body));
    } catch (err) {
        console.error(`Error while login`, err.message)
        next(err)
    }
}
async function update(req, res, next) {
    try {
        const data = req.body
        if (!data.avatar) data.avatar = 'avatar/avatar.png'
        console.log('Upload:', data)
        // res.json("ok")
        const userId = req.userId
        console.log(userId)
        res.json(await authServices.update(userId, data))
    } catch (err) {
        console.error(`Error while update`, err.message)
        next(err)
    }
}

module.exports = {
    getUser,
    signup,
    login,
    update,
    searchUsers,
}
