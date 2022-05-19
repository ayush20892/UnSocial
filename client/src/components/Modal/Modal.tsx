import React from "react";
import { Children } from "../../utils/types";
import "./Modal.css";

function Modal({ children }: Children) {
  return <div className="modal-page">{children}</div>;
}

export default Modal;
