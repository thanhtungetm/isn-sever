const { validationResult } = require('express-validator')
const friendService = require('../services/friend.service')

async function getFriends(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.get(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}
async function getNewRequestStatus(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.getNewRequestStatus(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}
async function updateNewRequestStatus(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.updateNewRequestStatus(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}
async function sugguestFriends(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.sugguestFriends(userId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}
async function getMentions(req, res, next) {
    try {
        const userId = req.userId
        const search = req.params.search
        res.json(await friendService.getMentions(userId,search))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}
async function removeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.params.friendId
        res.json(await friendService.removeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while getting your friends`, err.message)
        next(err)
    }
}
async function makeFriend(req, res, next) {
    try {
        res.json({ data: `Make friend with ${req.body.username}` })
    } catch (err) {
        console.error(`Error while make friend`, err.message)
        next(err)
    }
}
async function unFriend(req, res, next) {
    try {
        res.json({ data: `Unfriend with ${req.body.username}` })
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}
async function sendRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.body.friendId
        res.json(await friendService.sendRequestMakeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}
async function removeRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.params.friendId
        console.log('Remove request friend: ', userId, friendId)
        res.json(await friendService.removeRequestMakeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}
async function getAllRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        res.json(await friendService.getAllRequestMakeFriend(userId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}
async function refuseRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.body.friendId
        console.log('Refuse', userId, friendId)
        res.json(await friendService.removeRequestMakeFriend(friendId, userId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}
async function acceptRequestMakeFriend(req, res, next) {
    try {
        const userId = req.userId
        const friendId = req.body.friendId
        console.log('Accpet', userId, friendId)
        res.json(await friendService.acceptRequestMakeFriend(userId, friendId))
    } catch (err) {
        console.error(`Error while unfriend`, err.message)
        next(err)
    }
}

module.exports = {
    getFriends,
    getMentions,
    sugguestFriends,
    makeFriend,
    removeFriend,
    sendRequestMakeFriend,
    removeRequestMakeFriend,
    getAllRequestMakeFriend,
    refuseRequestMakeFriend,
    acceptRequestMakeFriend,
    unFriend,
    getNewRequestStatus,
    updateNewRequestStatus,
}
