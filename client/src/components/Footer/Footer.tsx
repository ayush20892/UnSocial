import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlinePlusSquare } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import userImage from "../../icon/user.png";
import "./footer.css";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../features/user/userSlice";
import { useSelector } from "react-redux";

export default function Footer() {
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(
      user.notification.filter((noti) => noti.isRead === false).length
    );
  }, []);

  return (
    <footer>
      <div className="footer-pill" onClick={() => navigate("/")}>
        <AiOutlineHome />
      </div>
      <div className="footer-pill" onClick={() => navigate("/explore")}>
        <MdOutlineExplore />
      </div>
      <div className="footer-pill" onClick={() => navigate("/createPost")}>
        <AiOutlinePlusSquare />
      </div>
      <div className="footer-pill" onClick={() => navigate("/notification")}>
        <IoNotificationsOutline />
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </div>
      <div
        className="footer-pill"
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
      </div>
    </footer>
  );
}
