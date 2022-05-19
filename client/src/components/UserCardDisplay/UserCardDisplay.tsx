import React from "react";
import { userType } from "../../utils/types";
import UserCard from "../UserCard/UserCard";
import "./UserCardDisplay.css";

function UserCardDisplay({ type, users }: { users: userType[]; type: string }) {
  return (
    <div className="user-card-display">
      <div className="heading">
        {type} &#9734; {users.length} Users
      </div>
      {users.map((user) => {
        return <UserCard user={user} key={user._id} />;
      })}
    </div>
  );
}

export default UserCardDisplay;
