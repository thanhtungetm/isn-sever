const db = require('./db.service')
const helper = require('../utils/helper.util')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const postService = require('./post.service')
const friendService = require('./friend.service')

const secret = require('../configs/jwt.config')

const SELF = 0
const NO_FRIEND = 1
const INVITATION = 2
const FRIEND = 3
const INVITE_ME = 4

async function getUser(userId, username) {
    const rows = await db.query(`select * from users where user_name = ? and user_complete_info= 1`, [username])
    
    const data = helper.emptyOrRows(rows)
    if(data.length===0)
        return Promise.reject({message: 'Not found the user!'})

    const userInfo = data[0]

    const postTotal = await postService.getTotalOfUserId(userInfo.user_id)
    const friendTotal = await friendService.getTotalOfUserId(userInfo.user_id)
    userInfo.post_total = postTotal
    userInfo.friend_total = friendTotal

    const postBriefData = await postService.getBrief(userInfo.user_id)
    userInfo.postBriefData = postBriefData.data

    if(userId === userInfo.user_id){
        return {data: {...userInfo, friendship: SELF}}
    }

    // Get friend info between userId with username
    const friends = await db.query(`select * from friend where user_id_1 = ? and user_id_2 = ?`, [userId, userInfo.user_id])
    if(friends.length!==0){
        return{data: {...userInfo, friendship: FRIEND}}
    }

    // Get status request make friend
    const requestFriends = await db.query(`select * from friend_invitation where user_id = ? and user_invite = ?`, [userId, userInfo.user_id])
    if(requestFriends.length!==0){
        return{data: {...userInfo, friendship: INVITATION}}
    }

    // Get status request make friend
    const requestMe = await db.query(`select * from friend_invitation where user_id = ? and user_invite = ?`, [userInfo.user_id, userId])
    if(requestMe.length!==0){
        return{data: {...userInfo, friendship: INVITE_ME}}
    }

    return{data: {...userInfo, friendship: NO_FRIEND}} 
}

async function searchUsers(userId, username) {
    const rows = await db.query(`select * from users where user_name Like '%${username}%' and user_complete_info= 1`, )
    
    const data = helper.emptyOrRows(rows)

    return{data} 
}
async function searchExistUsers(username) {
    const rows = await db.query(`select * from users where user_name = ?`,[username] )
    
    const data = helper.emptyOrRows(rows)

    return data[0]
}


async function login(user) {
    const { username } = user
    const rows = await db.query(`select * from users where user_name = ?`, [username])
    const data = helper.emptyOrRows(rows)
    if (data.length > 0) {
        const { password } = user
        const passMd5 = md5(password)
        const userInfo = {
            id: rows[0].user_id,
            username: rows[0].user_name,
            fullname: rows[0].user_fullname,
            gender: rows[0].user_gender,
            description: rows[0].user_description,
            email: rows[0].user_email,
            isCompleteInfo: rows[0].user_complete_info,
            avatar: rows[0].user_avatar
        }
        if (passMd5 === data[0].user_password) {
            const token = jwt.sign(userInfo, secret)
            return {
                message: 'Logged successfully',
                user: userInfo,
                token,
            }
        }
    }

    return Promise.reject({
        message: 'Logged fail',
    })
}

async function singup(user) {
    const { username, password, email } = user

    const rows = await db.query(
        `INSERT INTO users (user_name, user_password, user_email, user_allow_mention, permission) VALUES (?, ?, ?, 1, 1)`,
        [username, md5(password), email]
    )
    console.log('Last', rows)
    const userInfo = { username, email, id: rows.insertId, isCompleteInfo: false }
    const token = jwt.sign(userInfo, secret)
    return { message: 'Sign up successfully', user: userInfo, token }
}
async function update(userId, data) {
    const { fullname, email, description, gender, avatar } = data

    const rows = await db.query(
        `UPDATE users SET user_fullname = ?, user_email = ?, user_description = ?, user_gender = ?, user_complete_info = 1, user_avatar = ? WHERE users.user_id = ?`,
        [fullname, email, description, gender, avatar, userId]
    )

    return { message: 'Update successfully', user: data }
}

module.exports = {
    getUser,
    singup,
    login,
    update,
    searchUsers,
    searchExistUsers
}
