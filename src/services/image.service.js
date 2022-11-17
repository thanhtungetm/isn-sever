const db = require('./db.service')
const commentService = require('./comment.service')
const helper = require('../utils/helper.util')
const fs = require('fs')

async function getImages(postId) {
    const rows = await db.query(
        `select image.image_id, image.image_url  from image, post
        where image.post_id=post.post_id and image.post_id=?`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    return {
        data,
    }
}
async function getFirstImage(postId) {
    const rows = await db.query(
        `select image.image_id, image.image_url  from image
        where image.post_id=?`,
        [postId]
    )
    const data = helper.emptyOrRows(rows)

    return {
        data: data[0],
    }
}
async function addImages(postId, imageUrl) {
    const rows = await db.query(`INSERT INTO image (post_id, image_url) VALUES ( ? , ?)`, [
        postId,
        imageUrl,
    ])
    const data = helper.emptyOrRows(rows)

    return {
        data,
    }
}

async function deleteAll(postId) {
    await db.query(`DELETE FROM image WHERE image.post_id = ?`, [postId])

    return {
        message: 'Delete all images successfully',
    }
}

module.exports = {
    getImages,
    addImages,
    deleteAll,
    getFirstImage,
}
