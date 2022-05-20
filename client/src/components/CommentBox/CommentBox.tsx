import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCommentCall,
  addReplyCall,
  deleteCommentCall,
  deleteReplyCall,
  getOnePost,
} from "../../utils/networkCall/postCalls";
import Loader from "../Loader/Loader";
import "./CommentBox.css";
import userImage from "../../icon/user.png";
import { commentType, postType } from "../../utils/types";
import { createNotificationCall } from "../../utils/networkCall/userCalls";
import { useSelector } from "react-redux";
import { getUser } from "../../features/user/userSlice";

function CommentBox({ post }: { post: postType }) {
  const { postId } = useParams();
  const user = useSelector(getUser);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<commentType[]>([]);
  const [replyInputBox, setReplyInputBox] = useState("");
  const [networkLoader, setNetworkLoader] = useState(false);
  const navigate = useNavigate();

  async function getCommentsData() {
    setNetworkLoader(true);
    const { post } = await getOnePost(postId!);
    setNetworkLoader(false);
    setComments(post.comments);
  }

  async function commentHandler() {
    if (user._id === "") navigate("/landing");
    const data = await addCommentCall(postId!, text);
    if (user._id !== post.userId._id)
      await createNotificationCall({
        toUserId: post.userId._id,
        type: "Comment_Post",
        postId: postId,
      });
    const updatedComment = [...comments, data.newComment];
    setComments(updatedComment);
    setText("");
  }

  async function deleteCommentHandler(commentId: string) {
    const updatedComment = comments.filter((comm) => comm._id === commentId);
    setComments(updatedComment);
    await deleteCommentCall(postId!, commentId);
  }

  async function replyHandler(commentId: string) {
    const data = await addReplyCall(postId!, commentId, replyText);
    const updatedComment = comments.map((comm) => {
      if (comm._id === commentId) {
        comm.replies.push(data.newReply);
      }
      return comm;
    });
    setComments(updatedComment);
  }

  async function deleteReplyHandler(commentId: string, replyId: string) {
    const updatedComment = comments.map((comm) => {
      if (comm._id === commentId) {
        comm.replies = comm.replies.filter((repl) => repl._id !== replyId);
      }
      return comm;
    });
    setComments(updatedComment);
    await deleteReplyCall(postId!, commentId, replyId);
  }

  useEffect(() => {
    getCommentsData();
  }, [postId]);

  return (
    <div className="comment-box">
      <div className="user-comment">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a Comment"
        />
        <button onClick={commentHandler}>Comment</button>
      </div>
      {networkLoader ? (
        <div className="loader-inside ">
          <Loader />
        </div>
      ) : (
        <div className="comment-list">
          {comments.map((comm) => {
            return (
              <div className="comment-item" key={comm._id}>
                <img
                  src={
                    comm.user.profilePicture.secure_url !== ""
                      ? comm.user.profilePicture.secure_url
                      : userImage
                  }
                  alt="user"
                />
                <div className="comment-details">
                  <div className="user-detail">
                    <div className="name">{comm.user.name}</div>
                    <div className="username">@{comm.user.userName}</div>
                  </div>
                  <div className="comment-text">{comm.comment}</div>
                  <div className="comment-action">
                    {user._id === comm.user._id && (
                      <button onClick={() => deleteCommentHandler(comm._id)}>
                        Delete
                      </button>
                    )}
                    {replyInputBox !== comm._id ? (
                      <button onClick={() => setReplyInputBox(comm._id)}>
                        Reply
                      </button>
                    ) : (
                      <button onClick={() => setReplyInputBox("")}>
                        Close
                      </button>
                    )}
                  </div>
                  {replyInputBox === comm._id ? (
                    <div className="user-reply">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply..."
                      />
                      <button
                        onClick={() => {
                          setReplyText("");
                          setReplyInputBox("");
                          replyHandler(comm._id);
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="replies">
                    {comm.replies.map((repl) => {
                      return (
                        <div className="comment-item" key={repl._id}>
                          <img
                            src={
                              repl.user.profilePicture.secure_url !== ""
                                ? repl.user.profilePicture.secure_url
                                : userImage
                            }
                            alt="user"
                          />
                          <div className="comment-details">
                            <div className="user-detail">
                              <div className="name">{repl.user.name}</div>
                              <div className="username">
                                @{repl.user.userName}
                              </div>
                            </div>
                            <div className="comment-text">{repl.reply}</div>
                            <div className="comment-action">
                              {user._id === repl.user._id && (
                                <span
                                  onClick={() =>
                                    deleteReplyHandler(comm._id, repl._id)
                                  }
                                >
                                  Delete
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CommentBox;
