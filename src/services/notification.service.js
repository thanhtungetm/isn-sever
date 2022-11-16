const db = require('./db.service')
const helper = require('../utils/helper.util')

const MENTION = 0
const LIKE = 1
async function getAll(userId) {
    const mentionRows = await db.query(
        `SELECT comment.comment_id,users.user_avatar, comment.post_id,users.user_name, mentions.is_seen,comment.created_at FROM mentions, comment, users WHERE users.user_id = comment.user_id and comment.comment_id = mentions.comment_id and mention_user_id = ?`,
        [userId]
    )
    const mentionList = helper.emptyOrRows(mentionRows)
    //Mention notification
    mentionList.forEach((note) => {
        note.type = MENTION
    })

    const likeRows = await db.query(
        `SELECT users.user_id, users.user_avatar, likes.post_id, users.user_name, likes.is_seen, likes.created_at FROM likes, users, post 
        where likes.user_id = users.user_id 
            and likes.post_id = post.post_id
            and post.user_id <> likes.user_id
            and post.user_id = ?`,
        [userId]
    )
    const likeList = helper.emptyOrRows(likeRows)
    //Mention notification
    likeList.forEach((note) => {
        note.type = LIKE
    })

    return {
        data: [...mentionList, ...likeList].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
    }
}

async function updateNotifyStatus(userId, data) {
    console.log('updateNotifyStatus:', userId, data)
    if (data.type === MENTION) {
        await db.query(`UPDATE mentions SET is_seen = 1 where mention_user_id = ? and comment_id = ?`, [userId, data.commentId])
    }
    if (data.type === LIKE) {
        await db.query(
            `UPDATE likes SET likes.is_seen = 1 where likes.post_id = ? and likes.user_id = ?`,
            [data.postId, data.userId]
        )
    }
    return {
        message: 'Update notidy status successfully',
    }
}

module.exports = {
    getAll,
    updateNotifyStatus,
}
