import React from "react";
import { postType } from "../../utils/types";
import PostCard from "../PostCard/PostCard";
import "./postCardDisplay.css";

function PostCardDisplay({ posts }: { posts: postType[] }) {
  return (
    <div className="post-card-display">
      {posts.map((post) => {
        return <PostCard post={post} key={post._id} />;
      })}
    </div>
  );
}

export default PostCardDisplay;
