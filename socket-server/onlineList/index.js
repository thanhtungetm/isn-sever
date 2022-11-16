module.exports = (() => {
    let onlineUsers = []
    
    const addUser = (username, id) => {
        const user = onlineUsers.find((user) => user.username === username)
        if (user) {
            user.idList = [...user.idList, id]
        } else {
            const newUser = { username, idList: [id] }
            console.log('New user', newUser)
            onlineUsers.push(newUser)
        }
        console.log('Add use', username, id)
        console.log("List online", onlineUsers);
    }

    const removeUser = (username, id) => {
        const user = onlineUsers.find((user) => user.username === username)

        if (user.idList.length > 1) {
            user.idList = user.idList.filter((sId) => sId !== id)
        } else {
            onlineUsers = onlineUsers.filter((user) => user.username !== username)
        }
        console.log('User remove', user)
        console.log("List online", onlineUsers);
    }

    const getSocketIdList = (username) => {
        const user = onlineUsers.find((user) => user.username === username)
        if (user) return user.idList
        return []
    }
    return {
        addUser,
        removeUser,
        getSocketIdList,
    }
})()
