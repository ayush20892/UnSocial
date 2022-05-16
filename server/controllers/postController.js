const BigPromise = require("../middlewares/bigPromise");
const Post = require("../models/postModel");
const cloudinary = require("cloudinary").v2;
const { extend } = require("lodash");

exports.getAllPosts = BigPromise(async (req, res) => {
  const posts = await Post.find()
    .populate("userId")
    .populate("likes")
    .populate("comments.user")
    .populate("comments.replies.user");

  res.status(200).json({
    success: true,
    posts,
  });
});

exports.getSinglePost = BigPromise(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("userId")
    .populate("likes")
    .populate("comments.user")
    .populate("comment.replies.user");

  res.status(200).json({
    success: true,
    post,
  });
});

// Post Controller
exports.createPost = BigPromise(async (req, res) => {
  const user = req.user;

  const updatedObject = {
    textContent: req.body.textContent,
    userId: user._id,
  };

  if (req.files) {
    const photo = req.files.image;

    const result = await cloudinary.uploader.upload(photo.tempFilePath, {
      folder: "unsocial/post",
      width: 150,
      crop: "scale",
    });

    updatedObject.image = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const post = await Post.create(updatedObject);

  if (user.posts.find((post) => post._id.toString() === post._id))
    return res.json({
      success: false,
    });

  user.posts.push(post._id);

  await user.save();

  res.status(200).json({
    success: true,
    post,
  });
});

exports.deletePost = BigPromise(async (req, res) => {
  const user = req.user;
  const { postId } = req.body;
  const post = await Post.findById(postId);

  if (post?.image) await cloudinary.uploader.destroy(post.image.id);

  await post.delete();

  const updatedPosts = user.posts.filter(
    (post) => post._id.toString() !== postId
  );

  await user.updateOne({ posts: updatedPosts });

  res.status(200).json({
    success: true,
    post,
  });
});

exports.editPost = BigPromise(async (req, res) => {
  const { textContent } = req.body;
  const post = await Post.findById(req.params.postId);

  const updatedObject = {
    textContent,
  };

  if (req.files) {
    const photo = req.files.image;

    if (post.image.id !== "") await cloudinary.uploader.destroy(post.image.id);

    const result = await cloudinary.uploader.upload(photo.tempFilePath, {
      folder: "unsocial/post",
      width: 150,
      crop: "scale",
    });

    updatedObject.image = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const updatedPost = extend(post, updatedObject);

  await post.save();

  res.status(200).json({
    success: true,
    updatedPost,
  });
});

// Liked Posts Controller
exports.userLikesPost = BigPromise(async (req, res) => {
  const user = req.user;
  const { postId } = req.body;
  const post = await Post.findById(postId);

  if (
    post.likes.find(
      (likedUser) => likedUser._id.toString() === user._id.toString()
    )
  )
    return res.json({
      success: false,
    });

  post.likes.push(user._id);

  await post.save();

  // Post added to user liked
  if (user.likedPosts.find((post) => post._id.toString() === postId))
    return res.json({
      success: false,
    });

  user.likedPosts.push(postId);

  await user.save();

  res.status(200).json({
    success: true,
    post,
  });
});

exports.userUnlikedPost = BigPromise(async (req, res) => {
  const user = req.user;
  const { postId } = req.body;
  const post = await Post.findById(postId);

  const updatedPostLikes = post.likes.filter(
    (likedUser) => likedUser._id.toString() !== user._id.toString()
  );

  await post.updateOne({ likes: updatedPostLikes });

  // Remove from user likedPosts
  const updatedLikedPosts = user.likedPosts.filter(
    (post) => post._id.toString() !== postId
  );

  await user.updateOne({ likedPosts: updatedLikedPosts });

  res.status(200).json({
    success: true,
    post,
  });
});

// Comments Controller
exports.addComment = BigPromise(async (req, res) => {
  const user = req.user;
  const { postId, commentText } = req.body;
  const post = await Post.findById(postId);

  post.comments.push({ user: user._id, comment: commentText });

  await post.save();

  const newComment = post.comments[post.comments.length - 1];
  newComment.user = user;

  res.status(200).json({
    success: true,
    post,
    newComment,
  });
});

exports.deleteComment = BigPromise(async (req, res) => {
  const { postId, commentId } = req.body;
  const post = await Post.findById(postId);

  const updatedComments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );

  await post.updateOne({ comments: updatedComments });

  res.status(200).json({
    success: true,
    post,
  });
});

// Reply Controller
exports.addReply = BigPromise(async (req, res) => {
  const user = req.user;
  const { postId, commentId, replyText } = req.body;
  const post = await Post.findById(postId);

  post.comments.map((comment) => {
    if (comment._id.toString() === commentId)
      comment.replies.push({ user: user._id, reply: replyText });
  });

  await post.save();

  res.status(200).json({
    success: true,
    post,
  });
});

exports.deleteReply = BigPromise(async (req, res) => {
  const { postId, commentId, replyId } = req.body;
  const post = await Post.findById(postId);

  const updatedComments = post.comments.map((comment) => {
    if (comment._id.toString() === commentId) {
      comment.replies = comment.replies.filter(
        (reply) => reply._id.toString() !== replyId
      );
    }
    return comment;
  });

  await post.updateOne({ comments: updatedComments });

  res.status(200).json({
    success: true,
    post,
  });
});
