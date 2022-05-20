import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlinePlusSquare } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import userImage from "../../icon/user.png";
import "./footer.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../features/user/userSlice";
import { useSelector } from "react-redux";

export default function Footer() {
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const { pathname } = useLocation();

  function activeIcon(path: string) {
    if (path === pathname) return { borderBottom: "2px solid black" };
    return;
  }

  useEffect(() => {
    setUnreadCount(
      user.notification.filter((noti) => noti.isRead === false).length
    );
  }, []);

  return (
    <footer>
      <div
        className="footer-pill"
        onClick={() => navigate("/")}
        style={activeIcon("/")}
      >
        <AiOutlineHome />
      </div>
      <div
        className="footer-pill"
        onClick={() => navigate("/explore")}
        style={activeIcon("/explore")}
      >
        <MdOutlineExplore />
      </div>
      <div
        className="footer-pill"
        onClick={() => navigate("/createPost")}
        style={activeIcon("/createPost")}
      >
        <AiOutlinePlusSquare />
      </div>
      <div
        className="footer-pill"
        onClick={() => navigate("/notification")}
        style={activeIcon("/notification")}
      >
        <IoNotificationsOutline />
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </div>
      <div
        className="footer-pill"
        onClick={() => navigate(`/user/${user.userName}`)}
        style={activeIcon(`/user/${user.userName}`)}
      >
        <img
          src={
            user.profilePicture.secure_url !== ""
              ? user.profilePicture.secure_url
              : userImage
          }
          alt="user"
        />
      </div>
    </footer>
  );
}
