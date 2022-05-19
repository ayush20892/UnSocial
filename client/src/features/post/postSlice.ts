import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { likePayload, postType } from "../../utils/types";

type postIntialState = {
  posts: postType[];
  networkLoader: boolean;
  editPostModal: boolean;
  postToEdit: string;
};

const initialState: postIntialState = {
  posts: [],
  networkLoader: false,
  editPostModal: false,
  postToEdit: "",
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    loadPosts: (state, action: PayloadAction<postType[]>) => {
      state.posts = action.payload;
    },
    createPost: (state, action: PayloadAction<postType>) => {
      state.posts = [...state.posts, action.payload];
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    likePost: (state, action: PayloadAction<likePayload>) => {
      state.posts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          post.likes = [...post.likes, action.payload.user];
        }
        return post;
      });
    },
    unLikePost: (state, action: PayloadAction<likePayload>) => {
      state.posts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          post.likes = post.likes.filter(
            (post) => post._id === action.payload.post._id
          );
        }
        return post;
      });
    },
    toggleLoader: (state, action) => {
      state.networkLoader = action.payload;
    },
    toggleEditPostModal: (state, action) => {
      state.editPostModal = action.payload;
    },
    toggleToEditPost: (state, action) => {
      state.postToEdit = action.payload;
    },
  },
});

export const {
  loadPosts,
  createPost,
  deletePost,
  likePost,
  unLikePost,
  toggleLoader,
  toggleEditPostModal,
  toggleToEditPost,
} = postSlice.actions;

export const getPost = (state: RootState) => state.post;

export const getNetworkLoader = (state: RootState) => state.post.networkLoader;

export const getEditPostModal = (state: RootState) => state.post.editPostModal;

export const getToEditPost = (state: RootState) => state.post.postToEdit;

export default postSlice.reducer;
