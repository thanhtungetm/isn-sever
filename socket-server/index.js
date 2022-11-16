const notificationHandler = require('./handlers/notification')
const authorize = require('./auth')


const onlineList = require('./onlineList')
module.exports = (io) => {
    io.use(authorize)

    io.on('connection', (socket) => {
        socket.emit("hello", "connected")
        onlineList.addUser(socket.username, socket.id)

        notificationHandler(io, socket, onlineList)

        socket.on('disconnect', () => {
            onlineList.removeUser(socket.username, socket.id)
        })
    })
}