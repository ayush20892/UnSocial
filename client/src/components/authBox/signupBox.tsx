import "./authBox.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getNetworkLoader, toggleLoader } from "../../features/post/postSlice";
import { signup } from "../../utils/networkCall/userCalls";
import Loader from "../Loader/Loader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/user/userSlice";

export function SignupBox() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const networkLoader = useSelector(getNetworkLoader);

  async function signupHandler() {
    dispatch(toggleLoader(true));
    const data = await signup(name, userName, email, password);
    dispatch(toggleLoader(false));
    if (data!.success) {
      dispatch(login(data!.user));
      navigate("/", { replace: true });
    }
    setError(data!.message);
    setName("");
    setUserName("");
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
          <h3>Sign Up</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="UserName"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
          <h6>Note: Passwords are encrypted.</h6>
          {error !== "" && <h4>{error}</h4>}
          <button onClick={signupHandler}>Continue</button>
          <h5>
            Already a user?{" "}
            <Link to="/landing" style={{ textDecoration: "none" }}>
              LOGIN
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}
