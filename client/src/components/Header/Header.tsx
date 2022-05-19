import React, { useEffect, useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import icon64 from "../../icon/Utility-UI-64.png";
import { AiOutlineSearch } from "react-icons/ai";
import { BsX } from "react-icons/bs";
import { BsPlusSquare } from "react-icons/bs";

function Header() {
  const [search, setSearch] = useState("");
  const [searchCross, setSearchCross] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (search !== "") setSearchCross(true);
  }, [search]);

  return (
    <header>
      <div className="header-content">
        <div className="brand" onClick={() => navigate("/")}>
          <img src={icon64} alt="brand-logo" />
          <div className="brand-name">UNSOCIAL</div>
        </div>

        <div className="search-box">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              className="search-cross"
              onClick={() => {
                setSearch("");
                setSearchCross(false);
              }}
            >
              {searchCross ? <BsX /> : <></>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/search?key=${search}`)}
          >
            <AiOutlineSearch style={{ fontSize: "20px" }} />
          </button>
        </div>

        <div onClick={() => navigate("/createPost")} className="user-profile">
          <BsPlusSquare className="user-icon" />
          {/* <h4>
            {userState._id !== "" ? <>Hi, {userState.name}</> : <>LOGIN</>}
          </h4>
          <HiUserCircle className="user-icon" /> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
