import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import {
  getPost,
  getToEditPost,
  toggleEditPostModal,
} from "../../features/post/postSlice";
import "./EditPost.css";
import { editPostCall } from "../../utils/networkCall/postCalls";
import { useNavigate } from "react-router-dom";

function EditPost() {
  const postToEdit = useSelector(getToEditPost);
  const { posts } = useSelector(getPost);
  const post = posts.find((post) => post._id === postToEdit);
  const [textContent, setTextcontent] = useState(post!.textContent);
  const inputEl = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function editPostHandler() {
    dispatch(toggleEditPostModal(false));
    await editPostCall(postToEdit, textContent);
    navigate(`/post/${post?._id}`);
    window.location.reload();
  }

  useEffect(() => {
    setTextcontent(post!.textContent);
    inputEl.current!.focus();
  }, []);

  return (
    <div className="edit-post-modal">
      <div
        className="cross-btn"
        onClick={() => dispatch(toggleEditPostModal(false))}
      >
        <AiOutlineClose />
      </div>
      <div className="edit-post">
        {post!.image && (
          <img src={post!.image ? post!.image.secure_url : ""} alt="" />
        )}
        <textarea
          value={textContent}
          ref={inputEl}
          onChange={(e) => setTextcontent(e.target.value)}
        ></textarea>
        <div
          className="word-count"
          style={280 - textContent.length < 0 ? { color: "red" } : {}}
        >
          {280 - textContent.length}
        </div>
      </div>
      <div className="update-post-btn" onClick={editPostHandler}>
        Update
      </div>
    </div>
  );
}

export default EditPost;
