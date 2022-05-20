import React, { useState } from "react";
import "./actionMenuDropdown.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../features/user/userSlice";
import { deletePostCall } from "../../utils/networkCall/postCalls";
import {
  deletePost,
  toggleEditPostModal,
  toggleToEditPost,
} from "../../features/post/postSlice";
import { actionMenuType } from "../../utils/types";
import { useLocation, useNavigate } from "react-router-dom";

function ActionMenuDropdown({ item }: { item: string }) {
  const [dropDownDisplay, setDropDownDisplay] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const editPostButton = {
    action: "Edit Post",
    actionFunction: () => {
      dispatch(toggleToEditPost(item));
      dispatch(toggleEditPostModal(item));
    },
  };

  const deletePostButton = {
    action: "Delete Post",
    actionFunction: async () => {
      dispatch(deletePost(item));
      await deletePostCall(item);
      if (location.pathname.includes("/post/")) navigate("/");
    },
  };

  const actionMenu: actionMenuType[] = [editPostButton, deletePostButton];
  return (
    <div
      className="dropdown-action"
      tabIndex={0}
      onBlur={() => setDropDownDisplay(false)}
    >
      <BsThreeDotsVertical
        onClick={() => setDropDownDisplay(!dropDownDisplay)}
        className="three-dots"
      />
      {dropDownDisplay && (
        <div className="dropdown-list">
          {actionMenu.map((action) => {
            return (
              <div
                key={action.action}
                className="dropdown-option"
                onClick={() => action.actionFunction(item)}
              >
                <span>{/* <action.icon /> */}</span>
                {action.action}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActionMenuDropdown;
