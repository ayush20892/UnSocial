import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ForgotPasswordBox } from "./components/authBox/forgotPasswordBox";
import { PasswordResetBox } from "./components/authBox/passwordReset";
import { SignupBox } from "./components/authBox/signupBox";
import { VerifyCodeBox } from "./components/authBox/verifyCodeBox";
import EditPost from "./components/EditPost/EditPost";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Loader from "./components/Loader/Loader";
import Modal from "./components/Modal/Modal";
import Sidebar from "./components/Sidebar/Sidebar";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import Explore from "./pages/Explore";
import Feed from "./pages/Feed";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Landing from "./pages/Landing";
import Notification from "./pages/Notification";
import PasswordUpdate from "./pages/PasswordUpdate";
import Post from "./pages/Post";
import PostLike from "./pages/PostLike";
import Search from "./pages/Search";
import User from "./pages/User";
import { getEditPostModal, getNetworkLoader } from "./features/post/postSlice";
import loadInitialData from "./utils/loadInitialData";
import { PrivateRoute } from "./utils/privateRoute";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const networkLoader = useSelector(getNetworkLoader);
  const editPostModal = useSelector(getEditPostModal);
  const location = useLocation();

  useEffect(() => {
    loadInitialData({
      dispatch,
      navigate,
      setIsLoading,
    });
  }, []);

  if (location.pathname === "/landing") return <Landing />;
  if (location.pathname === "/signup") return <SignupBox />;
  if (location.pathname === "/forgotPassword") return <ForgotPasswordBox />;
  if (location.pathname === "/verifyCode") return <VerifyCodeBox />;
  if (location.pathname === "/passwordReset") return <PasswordResetBox />;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="loader">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="App">
      <Header />
      {editPostModal && (
        <Modal>
          <EditPost />
        </Modal>
      )}
      <main>
        {networkLoader && (
          <div className="network-loader">
            <Loader />
          </div>
        )}
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <PrivateRoute>
                  <Explore />
                </PrivateRoute>
              }
            />
            <Route
              path="/createPost"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route path="/post/:postId" element={<Post />} />
            <Route
              path="/likes"
              element={
                <PrivateRoute>
                  <PostLike />
                </PrivateRoute>
              }
            />
            <Route
              path="/notification"
              element={
                <PrivateRoute>
                  <Notification />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:userName"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/password"
              element={
                <PrivateRoute>
                  <PasswordUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/editProfile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/followers"
              element={
                <PrivateRoute>
                  <Followers />
                </PrivateRoute>
              }
            />
            <Route
              path="/following"
              element={
                <PrivateRoute>
                  <Following />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Landing />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
      <Footer />
    </div>
  );
}

export default App;
