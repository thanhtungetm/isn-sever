const express = require("express");
const { body, check, validationResult } = require("express-validator");
const router = express.Router();

const friendController = require("../controllers/friend.controller");

router.get("/", friendController.getFriends);
router.get("/status", friendController.getNewRequestStatus);
router.put("/status", friendController.updateNewRequestStatus);
router.get("/suggest", friendController.sugguestFriends);
router.get("/mentions/:search", friendController.getMentions);
router.delete("/:friendId", friendController.removeFriend);
router.post("/refuse", friendController.refuseRequestMakeFriend);
router.post("/accept", friendController.acceptRequestMakeFriend);
router.get("/invite", friendController.getAllRequestMakeFriend);
router.post("/invite", friendController.sendRequestMakeFriend);
router.delete("/invite/:friendId", friendController.removeRequestMakeFriend);
router.post(
  "/",
  body("username", "Username is not empty").isString().notEmpty(),
  friendController.makeFriend
);
router.delete(
  "/",
  body("username", "Username is not empty").isString().notEmpty(),
  friendController.unFriend
);
module.exports = router;
