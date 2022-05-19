import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import UserCardDisplay from "../components/UserCardDisplay/UserCardDisplay";
import { getUserCall } from "../utils/networkCall/userCalls";

function Following() {
  const { search } = useLocation();
  const userName = search.split("=")[1];
  const [networkLoader, setNetworkLoader] = useState(false);
  const [userList, setUserList] = useState([]);

  async function getUserData() {
    setNetworkLoader(true);
    const userFromCall = await getUserCall(userName!);
    setNetworkLoader(false);
    setUserList(userFromCall.user[0].following);
  }
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {networkLoader ? (
        <div className="loader-inside ">
          <Loader />
        </div>
      ) : (
        <UserCardDisplay type="Following" users={userList} />
      )}
    </>
  );
}

export default Following;
