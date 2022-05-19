import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import UserCardDisplay from "../components/UserCardDisplay/UserCardDisplay";
import { searchCall } from "../utils/networkCall/userCalls";

function Search() {
  const { search } = useLocation();
  const searchKey = search.split("=")[1];
  const [networkLoader, setNetworkLoader] = useState(false);
  const [userList, setUserList] = useState([]);

  async function getSearchResult() {
    setNetworkLoader(true);
    const searchResult = await searchCall(searchKey);
    setNetworkLoader(false);
    setUserList(searchResult.user);
  }

  useEffect(() => {
    getSearchResult();
  }, [searchKey]);

  return (
    <>
      {networkLoader ? (
        <div className="loader-inside ">
          <Loader />
        </div>
      ) : (
        <UserCardDisplay type="Followers" users={userList} />
      )}
    </>
  );
}

export default Search;
