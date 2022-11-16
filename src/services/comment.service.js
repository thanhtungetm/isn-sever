const db = require('./db.service')
const helper = require('../utils/helper.util')
const config = require('../configs/db.config')
const friendService = require('./friend.service')
const hashtagService = require('./hashtag.service')

//Get all comments by postId
async function getComments(postId) {
    if (!postId) return []
    const rows = await db.query(
        `SELECT comment_id, comment_content, post_id, reply_comment_id, comment.user_id, users.user_avatar, users.user_name, comment.created_at from comment, users where comment.user_id = users.user_id and comment.reply_comment_id is null and post_id = ? ORDER BY comment.created_at DESC`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    for (let comment of data) {
        const replyComments = await db.query(
            `SELECT comment_id, comment_content, post_id, reply_comment_id, comment.user_id, users.user_avatar, users.user_name, comment.created_at from comment, users where comment.user_id = users.user_id and comment.reply_comment_id = ? ORDER BY comment.created_at DESC`,
            [comment.comment_id]
        )
        const dataReply = helper.emptyOrRows(replyComments)
        for (cmt of dataReply) {
            const date = new Date(cmt.created_at)
            cmt.time_distance = helper.getDistanceTime(date)
        }
        comment.replies = dataReply

        const date = new Date(comment.created_at)
        comment.time_distance = helper.getDistanceTime(date)
    }

    return {
        data,
    }
}
async function getFristComment(postId) {
    if (!postId) return []
    const rows = await db.query(
        `SELECT comment_id, comment_content, post_id, reply_comment_id, comment.user_id, users.user_avatar, users.user_name from comment, users where comment.user_id = users.user_id and comment.reply_comment_id is null and post_id = ? LIMIT 1`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    return data[0]
}
async function getCommentCount(postId) {
    if (!postId) return []

    const rows = await db.query(`select count(*) as count from comment where comment.post_id = ?`, [
        postId,
    ])
    const data = helper.emptyOrRows(rows)
    const commentCount = data[0].count
    return commentCount
}
async function add(userId, postId, captionData, replyId) {
    const { content, mentions, hashtags } = captionData

    const row = await db.query(
        `INSERT INTO comment (post_id, user_id, comment_content,reply_comment_id) VALUES ( ?, ?, ?, ${
            replyId ? `'${replyId}'` : 'NULL'
        })`,
        [postId, userId, content]
    )
    const commentId = row.insertId
    //Add to mention
    for (let friendId of mentions) {
        await friendService.addMention(commentId, friendId)
    }

    //Add to hash
    for (let friendId of hashtags) {
        await hashtagService.addHashtag(commentId, friendId)
    }

    return { message: 'Add comment successfully!', comment_id: commentId }
}

async function deleteById(commentId) {
    console.log('deleteById Comment', commentId)
    const replyList = await db.query(
        `select comment.comment_id from comment where comment.reply_comment_id = ? `,
        [commentId]
    )
    const data = helper.emptyOrRows(replyList)

    for (let comment of data) await deleteById(comment.comment_id)

    //|Remove mentions
    await friendService.deleteAll(commentId)

    //Remove hashtag
    await hashtagService.deleteAll(commentId)

    await db.query(`DELETE FROM comment WHERE comment.comment_id = ?`, [commentId])

    return { message: 'Delete the comment successfully' }
}
async function deleteAll(postId) {
    const rows = await db.query(
        `select comment.comment_id from comment where comment.reply_comment_id is null and comment.post_id = ?`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    for (let comment of data) {
        await deleteById(comment.comment_id)
    }

    return { message: 'Delete all comment successfully' }
}

module.exports = {
    getComments,
    getCommentCount,
    getFristComment,
    add,
    deleteAll,
}
