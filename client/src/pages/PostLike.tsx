import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import UserCardDisplay from "../components/UserCardDisplay/UserCardDisplay";
import { getPost } from "../features/post/postSlice";

function PostLike() {
  const { search } = useLocation();
  const postId = search.split("=")[1];
  const { posts } = useSelector(getPost);
  const postLikeUsers = posts.find((post) => post._id === postId)?.likes;

  return <UserCardDisplay type="Likes" users={postLikeUsers!} />;
}

export default PostLike;
