import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  likePayload,
  notificationType,
  postType,
  userType,
} from "../../utils/types";
import {
  createPost,
  deletePost,
  likePost,
  unLikePost,
} from "../post/postSlice";

const initialState: userType = {
  _id: "",
  name: "",
  userName: "",
  email: "",
  role: "",
  bio: "",
  profilePicture: { id: "", secure_url: "" },
  following: [],
  followers: [],
  posts: [],
  likedPosts: [],
  bookmarkedPosts: [],
  archivePosts: [],
  notification: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<userType>) => {
      localStorage.setItem(
        "session",
        JSON.stringify({ userId: action.payload._id })
      );
      return { ...state, ...action.payload };
    },
    logout: () => {
      localStorage.setItem("session", JSON.stringify({ userId: null }));
      return {
        _id: "",
        name: "",
        userName: "",
        email: "",
        role: "",
        bio: "",
        profilePicture: { id: "", secure_url: "" },
        following: [],
        followers: [],
        posts: [],
        likedPosts: [],
        bookmarkedPosts: [],
        archivePosts: [],
        notification: [],
      };
    },
    followUser: (state, action: PayloadAction<userType>) => {
      state.following = [...state.following, action.payload];
    },
    unFollowUser: (state, action: PayloadAction<userType>) => {
      state.following = state.following.filter(
        (user) => user._id !== action.payload._id
      );
    },
    addToBookmark: (state, action: PayloadAction<postType>) => {
      state.bookmarkedPosts = [...state.bookmarkedPosts, action.payload];
    },
    removeFromBookmark: (state: userType, action: PayloadAction<postType>) => {
      state.bookmarkedPosts = current(state.bookmarkedPosts).filter(
        (post) => post._id !== action.payload._id
      );
    },
    updateNotification: (state) => {
      console.log(
        current(state.notification).map((notification) => {
          if (notification.isRead === false) notification.isRead = true;
          return notification;
        })
      );
      state.notification = current(state.notification).map((notification) => {
        if (notification.isRead === false) notification.isRead = true;
        return notification;
      });
    },
    deleteNotifications: (state: userType) => {
      return { ...state, notification: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost, (state, action: PayloadAction<postType>) => {
        state.posts = [...state.posts, action.payload];
      })
      .addCase(deletePost, (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(likePost, (state, action: PayloadAction<likePayload>) => {
        state.likedPosts = [...state.likedPosts, action.payload.post];
      })
      .addCase(unLikePost, (state, action: PayloadAction<likePayload>) => {
        state.likedPosts = state.likedPosts.filter(
          (post) => post._id !== action.payload.post._id
        );
      });
  },
});

export const {
  login,
  logout,
  followUser,
  unFollowUser,
  addToBookmark,
  removeFromBookmark,
  deleteNotifications,
  updateNotification,
} = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
