const express = require('express')
const router = express.Router()

//Middlewares
const authMiddleware = require('../middlewares/auth.middleware')
//Routes
const postRouter = require('./post.route')
const authRouter = require('./auth.route')
const messageRouter = require('./message.route')
const friendRouter = require('./friend.route')
const hashtagRouter = require('./hashtag.route')
const notificationRouter = require('./notification.route')
const commentRouter = require('./comment.route')
const reactionRouter = require('./reaction.route')

function setupRouter(app) {
    app.get('/', (req, res) => {
        res.json({ message: 'OK' })
    })
    app.use('/api/posts', authMiddleware.verifyToken, postRouter)
    app.use('/api/auths', authRouter)
    app.use('/api/messages', messageRouter)
    app.use('/api/friends', authMiddleware.verifyToken, friendRouter)
    app.use('/api/hashtags', authMiddleware.verifyToken, hashtagRouter)
    app.use('/api/notifications', authMiddleware.verifyToken, notificationRouter)
    app.use('/api/comments', authMiddleware.verifyToken, commentRouter)
    app.use('/api/reaction', authMiddleware.verifyToken, reactionRouter)
}
module.exports = setupRouter
