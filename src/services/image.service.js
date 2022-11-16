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
     const imageList = (await getImages(postId)).data
    // const imageList = [
    //     { image_id: 96, image_url: '/static/4-11-2022/1667529831995_1.png' },
    //     { image_id: 97, image_url: '/static/4-11-2022/1667529832000_1.png' },
    // ]

    for (let image of imageList) {
        const path = image.image_url.replace('/static', 'src/public')
        fs.unlinkSync(path)
    }
    await db.query(
      `DELETE FROM image WHERE image.post_id = ?`,
          [postId]
    );

    return {
        message: "Delete all images successfully",
    }
}

module.exports = {
    getImages,
    addImages,
    deleteAll,
    getFirstImage,
}
