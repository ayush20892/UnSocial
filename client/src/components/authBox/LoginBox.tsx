import "./authBox.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCall } from "../../utils/networkCall/userCalls";
import Loader from "../Loader/Loader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkLoader, toggleLoader } from "../../features/post/postSlice";
import { login } from "../../features/user/userSlice";

export function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const networkLoader = useSelector(getNetworkLoader);

  async function loginHandler() {
    dispatch(toggleLoader(true));
    const data = await loginCall(email, password);
    dispatch(toggleLoader(false));
    if (data!.success) {
      dispatch(login(data!.user));
      navigate("/", { replace: true });
    }
    setError(data!.message);
    setEmail("");
    setPassword("");
  }

  async function guestLoginHandler() {
    dispatch(toggleLoader(true));
    const data = await loginCall("ayush20892@gmail.com", "123456");
    dispatch(toggleLoader(false));
    if (data!.success) {
      dispatch(login(data!.user));
      navigate("/", { replace: true });
    }
    setError(data!.message);
    setEmail("");
    setPassword("");
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or Unsername"
          />
          <div className="password-input">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={!showPassword ? "password" : "text"}
              value={password}
              placeholder="Password"
            />
            <div
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>

          {error !== "" && <h4>{error}</h4>}
          <div className="forgotPass-btn">
            <Link to="/forgotPassword">Forgot Password ?</Link>
          </div>
          <button onClick={loginHandler}>Log In</button>
          <h5>Or</h5>
          <button className="guest-login-btn" onClick={guestLoginHandler}>
            Guest Login
          </button>
          <h5>
            New to Website?{" "}
            <Link to="/signup" style={{ textDecoration: "none" }}>
              SIGN UP
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}
