import React from "react";
import { LoginBox } from "../authBox/LoginBox";
import icon64 from "../../icon/Utility-UI-64.png";
import "./landingBox.css";

function LandingBox() {
  return (
    <div className="landing-page">
      <div className="landing-box">
        <div className="landing-greet">
          <div className="brand-name">
            <img src={icon64} alt="brand-logo" />
            <span>UNSOCIAL</span>
          </div>
          <div className="greeting">
            UnSocial helps you connect and share with the people in your life.
          </div>
        </div>
        <div className="auth-box">
          <LoginBox />
        </div>
      </div>
    </div>
  );
}

export default LandingBox;
