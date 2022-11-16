const secret = require('../../src/configs/jwt.config')
const jwt = require('jsonwebtoken')
const authorize = (socket, next) => {
    const username = verifyToken(socket.handshake.auth.token)
    if (username) {
        socket.username = username
        next()
    } else {
        const err = new Error('not authorized')
        err.data = { content: 'Please retry later' }
        next(err)
    }
}

const verifyToken = (token) => {
    try {
        jwt.verify(token, secret)
        const decode = jwt.verify(token, secret)
        return decode.username
    } catch (error) {
        return null
    }
}

module.exports = authorize