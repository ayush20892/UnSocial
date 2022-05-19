import React from "react";
import { useNavigate } from "react-router-dom";
import { userType } from "../../utils/types";
import userImage from "../../icon/user.png";
import "./UserCard.css";
import { searchInFollowing } from "../../utils/userUtils";
import {
  followUser,
  getUser,
  unFollowUser,
} from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createNotificationCall,
  followUserCall,
  unFollowUserCall,
} from "../../utils/networkCall/userCalls";

function UserCard({ user }: { user: userType }) {
  const userLoggedIn = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function followHandler() {
    const data = await followUserCall(user._id);
    await createNotificationCall({ toUserId: user._id, type: "Followed_User" });
    if (data.success) {
      dispatch(followUser(user));
    }
  }

  async function unFollowHandler() {
    const data = await unFollowUserCall(user._id);
    if (data.success) {
      dispatch(unFollowUser(user));
    }
  }

  return (
    <div className="user-card">
      <div
        className="user-details"
        onClick={() => navigate(`/user/${user.userName}`)}
      >
        <img
          src={
            user.profilePicture.secure_url !== ""
              ? user.profilePicture.secure_url
              : userImage
          }
          alt="user"
        />
        <span>
          <div className="name">{user.name}</div>
          <div className="username">@{user.userName}</div>
        </span>
      </div>
      <div className="action-btn">
        {userLoggedIn.userName === user.userName ? (
          <></>
        ) : searchInFollowing(userLoggedIn, user) ? (
          <button onClick={unFollowHandler}>Following</button>
        ) : (
          <button className="follow-btn" onClick={followHandler}>
            Follow
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
