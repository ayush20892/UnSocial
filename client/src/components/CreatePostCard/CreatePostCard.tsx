import React, { useState } from "react";
import "./createPostCard.css";
import { BsImage } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { InputEvent } from "../../utils/types";
import axios from "axios";
import { createPostCall } from "../../utils/networkCall/postCalls";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createPost,
  getNetworkLoader,
  toggleLoader,
} from "../../features/post/postSlice";
axios.defaults.withCredentials = true;

function CreatePostCard() {
  const [image, setImage] = useState<string | null>();
  const [imageFile, setImageFile] = useState<File | null>();
  const [textContent, setTextcontent] = useState("");
  const networkLoader = useSelector(getNetworkLoader);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleImageSelection(e: InputEvent) {
    if (e.currentTarget && e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      setImageFile(file);
      previewFile(file);
    }
  }

  function previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result?.toString());
    };
    reader.readAsDataURL(file);
  }

  async function postHandler() {
    dispatch(toggleLoader(true));
    const data = await createPostCall(imageFile!, textContent);
    dispatch(toggleLoader(false));
    if (data.success) {
      console.log(data.post);
      dispatch(createPost(data.post));
      navigate("/");
    }
  }
  return (
    <div className="create-post-card">
      <div className="create-post">
        {!image && (
          <div className="add-img">
            <input type="file" onChange={handleImageSelection} />
            <div className="add-btn">
              <BsImage /> <span>Add Image</span>
            </div>
          </div>
        )}
        {image && (
          <div className="show-img">
            <div
              className="remove-img"
              onClick={() => {
                setImage(null);
                setImageFile(null);
              }}
            >
              <AiOutlineClose className="close" />
            </div>
            <img src={image} alt="" />{" "}
          </div>
        )}
        <textarea
          className="add-textContent"
          placeholder="What's up, any idea to share ?"
          value={textContent}
          onChange={(e) => setTextcontent(e.target.value)}
        ></textarea>
        <div
          className="word-count"
          style={280 - textContent.length < 0 ? { color: "red" } : {}}
        >
          {280 - textContent.length}
        </div>
      </div>
      <button className="create-post-btn" onClick={() => postHandler()}>
        {networkLoader ? <>Posting..</> : <>Post</>}
      </button>
    </div>
  );
}

export default CreatePostCard;
