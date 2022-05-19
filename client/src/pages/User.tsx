import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import UserProfile from "../components/UserProfile/UserProfile";
import { getUser } from "../features/user/userSlice";
import { getUserCall } from "../utils/networkCall/userCalls";

function User() {
  const { userName } = useParams();
  const [networkLoader, setNetworkLoader] = useState(false);
  const userLoggedIn = useSelector(getUser);
  const [user, setUser] = useState(userLoggedIn);

  async function getUserData() {
    setNetworkLoader(true);
    const userFromCall = await getUserCall(userName!);
    setNetworkLoader(false);
    setUser(userFromCall.user[0]);
  }

  useEffect(() => {
    if (user.userName !== userName) getUserData();
    window.scrollTo(0, 0);
  }, [userName]);

  return (
    <>
      {networkLoader ? (
        <div className="loader-inside ">
          <Loader />
        </div>
      ) : (
        <UserProfile
          user={userLoggedIn.userName === userName ? userLoggedIn : user}
          type={
            userLoggedIn.userName === userName ? "ownProfile" : "userProfile"
          }
        />
      )}
    </>
  );
}

export default User;
