import React from "react";
import "./postCard.css";
import userImage from "../../icon/user.png";
import { postType } from "../../utils/types";
import {
  BsBookmark,
  BsFillBookmarkFill,
  BsHeart,
  BsHeartFill,
  BsShare,
} from "react-icons/bs";
import { GoComment } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckInList, searchInFollowing } from "../../utils/userUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBookmark,
  followUser,
  getUser,
  removeFromBookmark,
  unFollowUser,
} from "../../features/user/userSlice";
import { likePost, unLikePost } from "../../features/post/postSlice";
import {
  likePostCall,
  unlikePostCall,
} from "../../utils/networkCall/postCalls";
import {
  bookmarkPostCall,
  createNotificationCall,
  followUserCall,
  unBookmarkPostCall,
  unFollowUserCall,
} from "../../utils/networkCall/userCalls";
import { toast } from "react-toastify";
import ActionMenuDropdown from "../actionMenuDropdown/actionMenuDropdown";

function PostCard({ post }: { post: postType }) {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  async function likeHandler() {
    if (user._id === "") navigate("/landing");
    dispatch(likePost({ user, post }));
    await createNotificationCall({
      toUserId: post.userId._id,
      type: "Liked_Post",
      postId: post._id,
    });
    await likePostCall(post._id);
  }

  async function unLikeHandler() {
    dispatch(unLikePost({ user, post }));
    await unlikePostCall(post._id);
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://unsocial.netlify.app/post/${post._id}`);
    toast("Link Copied !");
  }

  async function bookmarkHandler() {
    if (user._id === "") navigate("/landing");
    dispatch(addToBookmark(post));
    await bookmarkPostCall(post._id);
  }

  async function unBookmarkHandler() {
    dispatch(removeFromBookmark(post));
    await unBookmarkPostCall(post._id);
  }

  async function followHandler() {
    const data = await followUserCall(post.userId._id);
    await createNotificationCall({
      toUserId: post.userId._id,
      type: "Followed_User",
    });
    if (data.success) {
      dispatch(followUser(post.userId));
    }
  }

  async function unFollowHandler() {
    const data = await unFollowUserCall(user._id);
    if (data.success) {
      dispatch(unFollowUser(user));
    }
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div
          className="user-info"
          onClick={() => navigate(`/user/${post.userId.userName}`)}
        >
          <img
            src={
              post.userId?.profilePicture &&
              post.userId?.profilePicture?.secure_url !== ""
                ? post.userId.profilePicture.secure_url
                : userImage
            }
            alt=""
          />
          <div className="userName">{post.userId.userName}</div>
        </div>
        {location.pathname === "/explore" && user._id !== post.userId._id ? (
          searchInFollowing(user, post.userId) ? (
            <button onClick={unFollowHandler} className="btn">
              Following
            </button>
          ) : (
            <button className="follow-btn btn" onClick={followHandler}>
              Follow
            </button>
          )
        ) : (
          <></>
        )}
        {user._id === post.userId._id && <ActionMenuDropdown item={post._id} />}
      </div>
      {post.image && (
        <img
          src={post.image ? post.image.secure_url : ""}
          alt=""
          onClick={() => navigate(`/post/${post._id}`)}
        />
      )}
      {post.textContent !== "" && (
        <div
          className="text-content"
          onClick={() => navigate(`/post/${post._id}`)}
        >
          {post.textContent}
        </div>
      )}
      <div className="action-btn">
        <div className="action-pill">
          {CheckInList(user.likedPosts, post._id) ? (
            <BsHeartFill
              className="action-icon fill-color"
              onClick={unLikeHandler}
            />
          ) : (
            <BsHeart className="action-icon" onClick={likeHandler} />
          )}
          <span onClick={() => navigate(`/likes?postId=${post._id}`)}>
            {post.likes.length > 0 ? <>{post.likes.length}</> : <></>}
          </span>
        </div>
        <div
          className="action-pill"
          onClick={() => navigate(`/post/${post._id}`)}
        >
          <GoComment className="action-icon" />{" "}
          <span>{post.comments.length > 0 ? post.comments.length : <></>}</span>
        </div>
        <div className="action-pill">
          <BsShare className="action-icon" onClick={copyLink} />
        </div>
        <div className="action-pill">
          {CheckInList(user.bookmarkedPosts, post._id) ? (
            <BsFillBookmarkFill
              className="action-icon fill-color"
              onClick={unBookmarkHandler}
            />
          ) : (
            <BsBookmark className="action-icon" onClick={bookmarkHandler} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
