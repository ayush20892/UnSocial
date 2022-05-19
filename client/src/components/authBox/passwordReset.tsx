import "./authBox.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getNetworkLoader, toggleLoader } from "../../features/post/postSlice";
import { passwordReset } from "../../utils/networkCall/userCalls";
import Loader from "../Loader/Loader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/user/userSlice";

export function PasswordResetBox() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const networkLoader = useSelector(getNetworkLoader);

  async function passwordResetHandler() {
    dispatch(toggleLoader(true));
    const data = await passwordReset(password, confirmPassword);
    dispatch(toggleLoader(false));
    if (data.success) {
      dispatch(login(data.user));
      navigate("/user", { replace: true });
    }
    setError(data.message);
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="login-main">
      {networkLoader && (
        <div className="network-loader">
          <Loader />
        </div>
      )}
      <div className="login-box">
        <div className="login-form">
          <h3>Password Reset</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className="password-input">
            <input
              type={!showPassword ? "password" : "text"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confrim Password"
            />
            <div
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
          {error !== "" && <h4>{error}</h4>}
          <button onClick={passwordResetHandler}>Continue</button>
          <h5>
            Remember Password?{" "}
            <Link to="/landing" style={{ textDecoration: "none" }}>
              LOGIN
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}
