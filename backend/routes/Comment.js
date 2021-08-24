const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/commentsCtrl")
const auth = require('../middleware/auth'); 

router.get("/",                commentCtrl .findAllComments);

router.get("/:messageid",      commentCtrl .findOneComment);

router.get("/all/:messageid",      commentCtrl .findAllOneComments);

router.post("/",         auth,     commentCtrl .createComment);

router.delete("/:commentId",        auth,      commentCtrl .deleteComment);

module.exports = router;
