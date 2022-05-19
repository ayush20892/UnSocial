import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userType } from "../../utils/types";
import PostCardDisplay from "../PostCardDsiplay/PostCardDisplay";
import userImage from "../../icon/user.png";
import "./UserProfile.css";
import {
  createNotificationCall,
  followUserCall,
  unFollowUserCall,
} from "../../utils/networkCall/userCalls";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  getUser,
  unFollowUser,
} from "../../features/user/userSlice";
import { getPost } from "../../features/post/postSlice";
import { getArrayMatch, searchInFollowing } from "../../utils/userUtils";

function UserProfile({ user, type }: { user: userType; type: string }) {
  const [tab, setTab] = useState("Posts");
  const [userFollower, setUserFollower] = useState(user.followers.length);
  const { posts } = useSelector(getPost);
  const navigate = useNavigate();
  const loggedInUser = useSelector(getUser);
  const dispatch = useDispatch();

  const tabs =
    type === "ownProfile"
      ? ["Posts", "Liked", "Bookmarked"]
      : ["Posts", "Liked"];

  function tabContentHandler() {
    if (tab === "Posts") return getArrayMatch(posts, user.posts);
    else if (tab === "Liked")
      return getArrayMatch(posts, user.likedPosts).reverse();
    else if (tab === "Bookmarked")
      return getArrayMatch(posts, user.bookmarkedPosts).reverse();
  }

  async function followHandler() {
    const data = await followUserCall(user._id);
    await createNotificationCall({ toUserId: user._id, type: "Followed_User" });
    if (data.success) {
      setUserFollower(userFollower + 1);
      dispatch(followUser(user));
    }
  }

  async function unFollowHandler() {
    const data = await unFollowUserCall(user._id);
    if (data.success) {
      setUserFollower(userFollower - 1);
      dispatch(unFollowUser(user));
    }
  }

  useEffect(() => {
    setUserFollower(user.followers.length);
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile-picture">
          <img
            src={
              user?.profilePicture?.secure_url !== ""
                ? user.profilePicture.secure_url
                : userImage
            }
            alt="user"
          />
        </div>
        <div className="profile-details">
          <div className="username">
            <span>{user.userName}</span>
            {type === "ownProfile" ? (
              <button onClick={() => navigate("/editProfile")}>
                Edit Profile
              </button>
            ) : searchInFollowing(loggedInUser, user) ? (
              <button onClick={unFollowHandler}>Following</button>
            ) : (
              <button className="follow-btn" onClick={followHandler}>
                Follow
              </button>
            )}
          </div>
          <div className="user-content-numbers">
            <div>
              <span>{user.posts.length}</span> Posts
            </div>
            <div onClick={() => navigate(`/followers?userId=${user.userName}`)}>
              <span>{userFollower}</span> Followers
            </div>
            <div onClick={() => navigate(`/following?userId=${user.userName}`)}>
              <span>{user.following.length}</span> Following
            </div>
          </div>
          <div className="information">
            <div className="name">{user.name}</div>
            <div className="bio">{user.bio}</div>
          </div>
        </div>
      </div>
      <div className="profile-content">
        <div className="tabs">
          {tabs.map((pill) => {
            return (
              <span
                className={tab === pill ? "tab-active" : ""}
                onClick={() => setTab(pill)}
                key={pill}
              >
                {pill}
              </span>
            );
          })}
        </div>
        <div className="tab-content">
          <PostCardDisplay posts={tabContentHandler()!} />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
