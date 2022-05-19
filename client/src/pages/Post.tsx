import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox/CommentBox";
import PostCardDisplay from "../components/PostCardDsiplay/PostCardDisplay";
import { getPost } from "../features/post/postSlice";

function Post() {
  const { postId } = useParams();
  const { posts } = useSelector(getPost);
  const post = posts.filter((singlePost) => singlePost._id === postId);
  return (
    <div className="post">
      <PostCardDisplay posts={post} />
      <CommentBox post={post[0]} />
    </div>
  );
}

export default Post;
