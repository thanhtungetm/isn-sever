const hashtagService = require("../services/hashtag.service");

async function search(req, res, next) {
  try {
    const search = req.params.search
    res.json(await hashtagService.search(search));
  } catch (err) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}


module.exports = {
  search,
};
