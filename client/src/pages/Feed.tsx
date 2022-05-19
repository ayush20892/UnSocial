import React from "react";
import { useSelector } from "react-redux";
import PostCardDisplay from "../components/PostCardDsiplay/PostCardDisplay";
import { getPost } from "../features/post/postSlice";
import { getUser } from "../features/user/userSlice";
import { postType } from "../utils/types";

function Feed() {
  const { posts } = useSelector(getPost);
  const loggedInUser = useSelector(getUser);

  let postarray: postType[] = [];
  for (let i = 0; i < loggedInUser.following.length; i++) {
    postarray = [
      ...postarray,
      ...posts.filter(
        (post) => post.userId._id === loggedInUser.following[i]._id
      ),
    ];
  }
  postarray = [
    ...postarray,
    ...posts.filter((post) => post.userId._id === loggedInUser._id),
  ];

  return <PostCardDisplay posts={postarray} />;
}

export default Feed;
