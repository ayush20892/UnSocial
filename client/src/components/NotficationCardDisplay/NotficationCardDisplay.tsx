import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotifications,
  getUser,
  updateNotification,
} from "../../features/user/userSlice";
import {
  deleteAllNotificationsCall,
  updateNotificationsCall,
} from "../../utils/networkCall/userCalls";
import NotificationCard from "../NotificationCard/NotificationCard";
import "./NotficationCardDisplay.css";

function NotficationCardDisplay() {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  async function updateNotificationHandler() {
    console.log("HELL YEAHHHH WHYYYY")
    if (user.notification.find((noti) => noti.isRead === false)) {
      // dispatch(updateNotification());
      const notificationArray = user.notification.filter(
        (noti) => noti.isRead === false
      );

      await updateNotificationsCall(notificationArray);
    }
  }

  useEffect(() => {
    updateNotificationHandler();
  }, []);

  async function clearNotificationHandler() {
    dispatch(deleteNotifications());
    await deleteAllNotificationsCall();
  }
  return (
    <div className="notification-card-display">
      <div className="heading">
        <span>Notfications &#9734; {user.notification.length} </span>
        <button onClick={clearNotificationHandler}>Clear All</button>
      </div>
      {user.notification.map((notification) => {
        return (
          <NotificationCard
            notification={notification}
            key={notification._id}
          />
        );
      })}
    </div>
  );
}

export default NotficationCardDisplay;
