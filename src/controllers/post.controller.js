const postServices = require("../services/post.service");
// const fs = require("node:fs");
const helpers = require('../utils/helper.util')

async function get(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getAllPosts(userId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}
async function getFriend(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getFriendPosts(userId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}
async function getById(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await postServices.getById(userId,postId));
  } catch (err) {
    console.error(`Error while get posts by Id`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    req.userId = req.userId
    const images = req.body.images;
    const captionData = req.body.captionData;
    const aspect = helpers.getAspect(req.body.aspect);

    console.log("Caption data:", captionData);

    // const imageUrlList = []

    console.log("IMAGES URL:", images);

    // for (let img of images) {
    //   const date = new Date();
    //   const dir = `src/public/${date.getDate()}-${
    //     date.getMonth() + 1
    //   }-${date.getFullYear()}`;

    //   if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir, { recursive: true });
    //   }
    //   const path = dir + "/" + Date.now() + ".png";
    //   const base64Data = img.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    //   fs.writeFileSync(path, base64Data, { encoding: "base64" });
    //   imageUrlList.push(path)`
    // }
    await postServices.create(req.userId,images, captionData, aspect)
    res.json({ data: { message: "Create the post successfully!" } });
  } catch (err) {
    console.error(`Error `, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await postServices.remove(userId,postId));
  } catch (err) {
    console.error(`Error while get posts by Id`, err.message);
    next(err);
  }
}
async function getLikedPosts(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getLikedPosts(userId));
  } catch (err) {
    console.error(`Error while get liked posts`, err.message);
    next(err);
  }
}
async function getMentionedPosts(req, res, next) {
  try {
    const userId = req.userId
    res.json(await postServices.getMentionedPosts(userId));
  } catch (err) {
    console.error(`Error while get mentioned posts`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  getById,
  create,
  remove,
  getLikedPosts,
  getMentionedPosts,
  getFriend,
};
