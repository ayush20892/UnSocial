import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import userImage from "../../icon/user.png";
import { useSelector } from "react-redux";
import { getUser } from "../../features/user/userSlice";

function Sidebar() {
  const user = useSelector(getUser);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setUnreadCount(
      user.notification.filter((noti) => noti.isRead === false).length
    );
  }, []);

  return (
    <ul className="sidebar">
      <li onClick={() => navigate("/")}>
        <AiOutlineHome className="sidebar-pill" />
        Home
      </li>
      <li onClick={() => navigate("/explore")}>
        <MdOutlineExplore className="sidebar-pill" />
        Explore
      </li>
      <li onClick={() => navigate("/notification")}>
        <IoNotificationsOutline className="sidebar-pill" />
        {unreadCount > 0 && <span>{unreadCount}</span>}
        Notifications
      </li>
      <li onClick={() => navigate(`/user/${user.userName}`)}>
        <img
          src={
            user.profilePicture.secure_url !== ""
              ? user.profilePicture.secure_url
              : userImage
          }
          alt="user"
        />
        Profile
      </li>
    </ul>
  );
}

export default Sidebar;
