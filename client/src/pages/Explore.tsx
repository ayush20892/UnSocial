import React from "react";
import { useSelector } from "react-redux";
import PostCardDisplay from "../components/PostCardDsiplay/PostCardDisplay";
import { getPost } from "../features/post/postSlice";
import { getUser } from "../features/user/userSlice";

function Explore() {
  const { posts } = useSelector(getPost);
  const users = useSelector(getUser);
  const explorePosts = posts.filter((post) => post.userId._id !== users._id);

  return <PostCardDisplay posts={explorePosts} />;
}

export default Explore;
