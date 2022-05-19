import "./updateBox.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateUserPassowrdCall } from "../../utils/networkCall/userCalls";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../features/user/userSlice";
import { getNetworkLoader } from "../../features/post/postSlice";
import Loader from "../Loader/Loader";

export function UpdateUserPasswordBox() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector(getUser);
  const networkLoader = useSelector(getNetworkLoader);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function userUpdateHandler() {
    const data = await updateUserPassowrdCall(
      oldPassword,
      password,
      confirmPassword
    );
    console.log(data);
    if (data.success) {
      dispatch(login(data.user));
      navigate(`/user/${user.userName}`, { replace: true });
    }
    setError(data.message);
    setOldPassword("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="update-main">
      {networkLoader && (
        <div className="loader-inside">
          <Loader />
        </div>
      )}
      <div className="update-box">
        <div className="update-form">
          <h3>Update Password</h3>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          <div className="password-input">
            <input
              type={!showPassword ? "password" : "text"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confrim Password"
            />{" "}
            <div
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
          {error !== "" && <h4>{error}</h4>}
          <button onClick={userUpdateHandler}>Update</button>
          <h5>
            Go to user Dashboard{" "}
            <Link
              to={`/user/${user.userName}`}
              style={{ textDecoration: "none" }}
            >
              DASHBOARD
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}
