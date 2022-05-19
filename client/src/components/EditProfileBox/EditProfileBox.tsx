import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../features/user/userSlice";
import userImage from "../../icon/user.png";
import {
  logoutCall,
  updateUserDataCall,
} from "../../utils/networkCall/userCalls";
import { InputEvent } from "../../utils/types";
import "./EditProfileBox.css";

function EditProfileBox() {
  const user = useSelector(getUser);
  const [image, setImage] = useState<string>(user.profilePicture.secure_url);
  const [imageFile, setImageFile] = useState<File | null>();
  const [name, setName] = useState(user.name);
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletePicture, setDeletePicture] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setImage(user.profilePicture.secure_url);
    setName(user.name);
    setUserName(user.userName);
    setEmail(user.email);
    setBio(user.bio);
  }, [user]);

  function handleProfilePictureSelection(e: InputEvent) {
    console.log("LOL");
    setDeletePicture("");
    if (e.currentTarget && e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      setImageFile(file);
      previewFile(file);
    }
  }

  function previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result?.toString()!);
    };
    reader.readAsDataURL(file);
  }

  async function updateProfileHandler() {
    const data = await updateUserDataCall(
      imageFile!,
      name,
      userName,
      email,
      bio,
      deletePicture
    );
    setErrorMessage(data?.message ? data.message : "");
    if (data.success) {
      navigate(`/user/${userName}`);
      window.location.reload();
    }
  }

  function deleteProfiletePictureHandler() {
    setImageFile(null);
    setImage("");
    setDeletePicture("DELETE");
  }

  async function logoutHandler() {
    await logoutCall();
    dispatch(logout());
    navigate("/landing");
  }

  return (
    <div className="edit-profile">
      <h3>Profile Picture</h3>
      <div className="edit-profile-picture">
        <img src={image !== "" ? image! : userImage} alt="" />
        {image !== "" && (
          <div className="delete-btn" onClick={deleteProfiletePictureHandler}>
            <AiOutlineClose />
          </div>
        )}
        <div className="edit-btn">
          <input type="file" onChange={handleProfilePictureSelection} />
          <AiFillEdit />
        </div>
      </div>
      <h4>Name</h4>
      <input
        value={name}
        placeholder="Name"
        type="text"
        onChange={(e) => setName(e.target.value)}
        className="name"
      ></input>
      <h4>UserName</h4>
      <input
        value={userName}
        placeholder="UserName"
        onChange={(e) => setUserName(e.target.value)}
        className="userName"
        type="text"
      ></input>
      <h4>Email</h4>
      <input
        value={email}
        placeholder="Email"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        className="email"
      ></input>
      <h4>Bio</h4>
      <textarea
        value={bio}
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        className="bio"
      ></textarea>
      {errorMessage !== "" && (
        <div className="error-message">{errorMessage}</div>
      )}
      <button onClick={updateProfileHandler}>Update Profile</button>
      <hr />
      <h4>Update Password</h4>
      <button onClick={() => navigate("/user/password")}>
        Update Password
      </button>
      <hr />
      <button onClick={logoutHandler} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default EditProfileBox;
