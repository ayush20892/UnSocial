import React from "react";
import { notificationType } from "../../utils/types";
import userImage from "../../icon/user.png";
import "./NotificationCard.css";
import { useNavigate } from "react-router-dom";

function NotificationCard({
  notification,
}: {
  notification: notificationType;
}) {
  const { fromUser, type, post } = notification;
  const navigate = useNavigate();
  return (
    <div className="notification-card">
      <div
        className="user-details"
        onClick={() => navigate(`/user/${fromUser.userName}`)}
      >
        ✨
        <img
          src={
            fromUser?.profilePicture &&
            fromUser.profilePicture.secure_url !== ""
              ? fromUser.profilePicture.secure_url
              : userImage
          }
          alt="user"
        />
        <div className="username">{fromUser.userName}</div>
      </div>
      <div className="notification-message">
        {type === "Followed_User" && <>started to Follow you.</>}
        {type === "Liked_Post" && (
          <>
            Liked your{" "}
            <span onClick={() => navigate(`/post/${post?._id}`)}>post</span>.
          </>
        )}
        {type === "Comment_Post" && (
          <>
            Commented on your{" "}
            <span onClick={() => navigate(`/post/${post?._id}`)}>post</span>.
          </>
        )}
        ✨
      </div>
    </div>
  );
}

export default NotificationCard;
