const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getSinglePost,
  createPost,
  editPost,
  userLikesPost,
  userUnlikedPost,
  addComment,
  deleteComment,
  addReply,
  deleteReply,
  deletePost,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/user");

// GET Posts Routes
router.route("/getAllPosts").get(isLoggedIn, getAllPosts);
router.route("/post/:postId").get(isLoggedIn, getSinglePost);

// Posts Create & Edit
router
  .route("/post")
  .post(isLoggedIn, createPost)
  .delete(isLoggedIn, deletePost);
router.route("/editPost/:postId").post(isLoggedIn, editPost);

// Likes
router
  .route("/post/like")
  .post(isLoggedIn, userLikesPost)
  .delete(isLoggedIn, userUnlikedPost);

// Comment
router
  .route("/post/comment")
  .post(isLoggedIn, addComment)
  .delete(isLoggedIn, deleteComment);

// Reply
router
  .route("/post/comment/reply")
  .post(isLoggedIn, addReply)
  .delete(isLoggedIn, deleteReply);

module.exports = router;
