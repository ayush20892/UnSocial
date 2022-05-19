import axios from "axios";
axios.defaults.withCredentials = true;

const { REACT_APP_BACKEND_URL_TEST } = process.env;

export const getAllPosts = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL_TEST}/getAllPosts`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getOnePost = async (postId: string) => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL_TEST}/post/${postId}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createPostCall = async (imageFile: File, textContent: string) => {
  try {
    let formData = new FormData();
    formData.append("image", imageFile);
    formData.append("textContent", textContent);
    const { data } = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL_TEST}/post`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const editPostCall = async (postId: string, textContent: string) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL_TEST}/editPost/${postId}`,
      data: { textContent },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePostCall = async (postId: string) => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/post`,
      data: {
        postId: postId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const likePostCall = async (postId: string) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/post/like`,
      data: {
        postId: postId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const unlikePostCall = async (postId: string) => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/post/like`,
      data: {
        postId: postId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const addCommentCall = async (postId: string, commentText: string) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/post/comment`,
      data: {
        postId,
        commentText,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCommentCall = async (postId: string, commentId: string) => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/post/comment`,
      data: {
        postId,
        commentId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const addReplyCall = async (
  postId: string,
  commentId: string,
  replyText: string
) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/post/comment/reply`,
      data: {
        postId,
        commentId,
        replyText,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteReplyCall = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/post/comment/reply`,
      data: {
        postId,
        commentId,
        replyId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};
