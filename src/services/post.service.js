const db = require('./db.service')
const commentService = require('./comment.service')
const imagesService = require('./image.service')
const reactionService = require('./reaction.service')
const helper = require('../utils/helper.util')
const { getMentions } = require('./friend.service')

async function getAllPosts(userId) {
    const rows = await db.query(
        `SELECT post.post_id,users.user_name, users.user_fullname, users.user_avatar, aspect, post.created_at
      from post, users
      where post.user_id=users.user_id
      ORDER BY post.created_at DESC`
    )
    const data = helper.emptyOrRows(rows)

    for (let post of data) {
        const images = await imagesService.getImages(post.post_id)
        const likeData = await reactionService.getLikes(post.post_id, userId)
        const commentCount = await commentService.getCommentCount(post.post_id)
        const comment = await commentService.getFristComment(post.post_id)

        post.total_comments = commentCount
        post.comment = comment
        post.likeData = likeData

        post.images = images.data
        // post.images = images.data
        const date = new Date(post.created_at)
        post.time_distance = helper.getDistanceTime(date)

        //additional information
        // {
        //   total_post,
        //   recent_images,
        // }
    }

    return {
        data,
    }
}
async function getFriendPosts(userId) {
    const rows = await db.query(
        `SELECT post.post_id,users.user_name, users.user_fullname, users.user_avatar, aspect, post.created_at
        from post, users
        where post.user_id=users.user_id
        and 
        (post.user_id IN (
            SELECT users.user_id FROM friend,users WHERE friend.user_id_2 = users.user_id and friend.user_id_1 = ?
        )
         or post.user_id = ? or post.user_id = 1
        )
        ORDER BY post.created_at DESC`,
        [userId, userId]
    )
    const data = helper.emptyOrRows(rows)

    for (let post of data) {
        const images = await imagesService.getImages(post.post_id)
        const likeData = await reactionService.getLikes(post.post_id, userId)
        const commentCount = await commentService.getCommentCount(post.post_id)
        const comment = await commentService.getFristComment(post.post_id)

        post.total_comments = commentCount
        post.comment = comment
        post.likeData = likeData

        post.images = images.data
        // post.images = images.data
        const date = new Date(post.created_at)
        post.time_distance = helper.getDistanceTime(date)

        //additional information
        // {
        //   total_post,
        //   recent_images,
        // }
    }

    return {
        data,
    }
}
async function getById(userId, postId) {
    const rows = await db.query(
        `SELECT post.post_id,users.user_name, users.user_fullname, users.user_avatar, aspect, post.created_at
      from post, users
      where post.user_id=users.user_id and post.post_id = ?
      ORDER BY post.created_at DESC`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    if (data.length === 0) return Promise.reject('No post with this id')

    const post = data[0]

    const images = await imagesService.getImages(post.post_id)
    const likeData = await reactionService.getLikes(post.post_id, userId)
    const commentCount = await commentService.getCommentCount(post.post_id)
    const comment = await commentService.getFristComment(post.post_id)

    post.total_comments = commentCount
    post.comment = comment
    post.likeData = likeData
    post.images = images.data
    const date = new Date(post.created_at)
    post.time_distance = helper.getDistanceTime(date)

    //additional information
    // {
    //   total_post,
    //   recent_images,
    // }

    return {
        data: post,
    }
}
async function getBrief(userId) {
    const rows = await db.query(
        `SELECT post.post_id from post
      where post.user_id = ?
      ORDER BY post.created_at DESC`,
        [userId]
    )
    const data = helper.emptyOrRows(rows)

    for (let post of data) {
        const image = await imagesService.getFirstImage(post.post_id)
        post.image = image.data
    }

    return {
        data,
    }
}
async function getLikedPosts(userId) {
    const rows = await db.query(
        `SELECT likes.post_id from likes WHERE likes.user_id = ?
        and likes.post_id not in (SELECT post_id from post WHERE user_id = ?)
      ORDER BY likes.created_at DESC`,
        [userId, userId]
    )
    const data = helper.emptyOrRows(rows)

    for (let post of data) {
        const image = await imagesService.getFirstImage(post.post_id)
        post.image = image.data
    }

    return {
        data,
    }
}
async function getMentionedPosts(userId) {
    const rows = await db.query(
        `SELECT post.post_id FROM mentions,comment ,post WHERE 
        mentions.comment_id=comment.comment_id and comment.post_id = post.post_id
        and mentions.mention_user_id = ?
        GROUP by post.post_id
        ORDER BY mentions.created_at DESC`,
        [userId]
    )
    const data = helper.emptyOrRows(rows)

    for (let post of data) {
        const image = await imagesService.getFirstImage(post.post_id)
        post.image = image.data
    }

    return {
        data,
    }
}

async function create(userId, imageUrlList, captionData, aspect) {
    const rows = await db.query(
        `INSERT INTO post (user_id, post_status,aspect) VALUES (?, '1', ?)`,
        [userId, aspect]
    )

    console.log(rows.affectedRows)
    if (!rows.affectedRows) console.error('Loi', rows)

    const postId = rows.insertId

    console.log('Image List', imageUrlList)
    // Add Image to this post
    for (let imageUrl of imageUrlList) {
        await imagesService.addImages(postId, imageUrl)
    }

    //Add first comment
    if (captionData.content) await commentService.add(userId, postId, captionData)

    // //Add mention
    // if(getMentions.lengths!==0){
    //     await db.query(`INSERT INTO post (user_id, post_status,aspect) VALUES (?, '1', ?)`, [userId,aspect])
    // }

    return {
        message: 'Create a post',
    }
}

async function getTotalOfUserId(userId) {
    const rows = await db.query(`select count(*) as count from post where post.user_id = ?`, [
        userId,
    ])
    const data = helper.emptyOrRows(rows)
    return data[0].count
}

async function deleteAllSaved(postId) {
    await db.query(`DELETE FROM post_saved WHERE post_saved.post_id = ?`, [postId])

    return {
        message: 'Delete all saved posts successfully!',
    }
}
async function remove(userId, postId) {
    await imagesService.deleteAll(postId)
    await reactionService.deleteAll(postId)
    // await deleteAllSaved(postId)
    await commentService.deleteAll(postId)
    await db.query(`DELETE FROM post where post.post_id = ?`, [postId])

    return { message: 'Remove the post successfully' }
}

module.exports = {
    getAllPosts,
    getFriendPosts,
    getTotalOfUserId,
    getById,
    create,
    remove,
    getBrief,
    getLikedPosts,
    getMentionedPosts,
}
