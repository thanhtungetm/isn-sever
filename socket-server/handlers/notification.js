const LIKE = 0
const UNLIKE = 1

const MENTION_NOTIFY = 2
const COMMENT_NOTIFY = 3

module.exports = (io, socket, onlineList) => {
    const likeNotification = (payload) => {
        const idList = onlineList.getSocketIdList(payload.to)

        idList.forEach((id) => {
            id !== socket.id &&
                io.to(id).emit('notification:like', {
                    from: payload.from,
                    postId: payload.postId,
                    number: payload.type === LIKE ? 1 : -1,
                })
        })
        socket.broadcast.emit('notification:broadcast:like', {
            postId: payload.postId,
            number: payload.type === LIKE ? 1 : -1,
        })
        console.log('LIKE:', payload)
    }
    const createNotification = (payload) => {
        socket.broadcast.emit('notification:broadcast:create', {
            from: payload.from,
        })
        console.log('CREATE:', payload)
    }
    const commentNotification = (payload) => {
        const mentionList = payload.mentions
        for(let mention of mentionList){
            const idList = onlineList.getSocketIdList(mention.user_name)
            idList.forEach((id) => {
                if (id === socket.id) return
                io.to(id).emit('notification:comment', {
                    from: payload.from,
                    type: MENTION_NOTIFY
                })
            })
        }

        const idList = onlineList.getSocketIdList(payload.to)
        idList.forEach((id) => {
            if (id === socket.id) return
            io.to(id).emit('notification:comment', {
                from: payload.from,
                type:COMMENT_NOTIFY
            })
        })
        socket.broadcast.emit('notification:broadcast:comment', {
            postId: payload.postId,
            data: payload.commentData
        })
        console.log('COMMENT:', payload)
    }
    const makeFriendNotification = (payload) => {
        const idList = onlineList.getSocketIdList(payload.to)

        idList.forEach((id) => {
            if (id === socket.id) return
            io.to(id).emit('notification:makeFriend', {
                from: payload.from,
                type: payload.type,
            })
            io.to(id).emit('notification:action:makeFriend', {
                from: payload.from,
                type: payload.type,
            })
            io.to(id).emit('notification:action:suggest:makeFriend', {
                from: payload.from,
                type: payload.type,
            })
            io.to(id).emit('notification:action:profile:makeFriend', {
                type: payload.type,
            })
        })
        console.log('MAKE_FRIEND:', payload)
    }
    const friendNotification = (payload) => {
        const idList = onlineList.getSocketIdList(payload.to)

        idList.forEach((id) => {
            id !== socket.id &&
                io.to(id).emit('notification:friend', {
                    from: payload.from,
                    type: payload.type,
                })
            io.to(id).emit('notification:action:friend', {
                from: payload.from,
                type: payload.type,
            })
            io.to(id).emit('notification:action:profile:friend', {
                type: payload.type,
            })
        })
        console.log('FRIEND:', payload)
    }

    socket.on('notification:like', likeNotification)
    socket.on('notification:create', createNotification)
    socket.on('notification:comment', commentNotification)
    socket.on('notification:makeFriend', makeFriendNotification)
    socket.on('notification:friend', friendNotification)
}
