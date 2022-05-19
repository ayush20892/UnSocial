import axios from "axios";
import { notificationType } from "../types";
axios.defaults.withCredentials = true;

const { REACT_APP_BACKEND_URL_TEST } = process.env;

export async function signup(
  name: string,
  userName: string,
  email: string,
  password: string
) {
  try {
    const { data } = await axios.post(`${REACT_APP_BACKEND_URL_TEST}/signup`, {
      name,
      userName,
      email,
      password,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function loginCall(email: string, password: string) {
  try {
    const { data } = await axios.post(`${REACT_APP_BACKEND_URL_TEST}/login`, {
      email,
      userName: email,
      password,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

export const logoutCall = async () => {
  try {
    await axios.get(`${REACT_APP_BACKEND_URL_TEST}/logout`);
  } catch (err) {
    console.log(err);
  }
};

export async function forgotPassword(email: string) {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL_TEST}/forgotPassword`,
      {
        email,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function verifyCode(forgotCode: string) {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL_TEST}/verifyCode`,
      {
        forgotCode,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function passwordReset(password: string, confirmPassword: string) {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL_TEST}/password/reset`,
      {
        password,
        confirmPassword,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function userDashboard() {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL_TEST}/userDashboard`
    );
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
}

export const updateUserDataCall = async (
  imageFile: File,
  name: string,
  userName: string,
  email: string,
  bio: string,
  deletePicture: string
) => {
  try {
    let formData = new FormData();
    formData.append("profilePicture", imageFile);
    formData.append("name", name);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("deletePicture", deletePicture);
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/user/update`,
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

export const updateUserPassowrdCall = async (
  oldPassword: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/password/update`,
      data: {
        oldPassword,
        password,
        confirmPassword,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const followUserCall = async (userId: string) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/user/follow`,
      data: {
        userId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const unFollowUserCall = async (userId: string) => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/user/follow`,
      data: {
        userId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const bookmarkPostCall = async (postId: string) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/user/bookmarkedPost`,
      data: {
        postId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const unBookmarkPostCall = async (postId: string) => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/user/bookmarkedPost`,
      data: {
        postId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserCall = async (userName: string) => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL_TEST}/user/${userName}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const searchCall = async (searchKey: string) => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL_TEST}/search?search=${searchKey}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createNotificationCall = async ({
  toUserId,
  type,
  postId,
}: {
  toUserId: string;
  type: string;
  postId?: string;
}) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/notification/create`,
      data: {
        toUserId,
        type,
        postId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllNotificationsCall = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL_TEST}/notification`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteAllNotificationsCall = async () => {
  try {
    const { data } = await axios({
      method: "delete",
      url: `${REACT_APP_BACKEND_URL_TEST}/notification`,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const updateNotificationsCall = async (
  notificationIdArray: notificationType[]
) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${REACT_APP_BACKEND_URL_TEST}/notification`,
      data: { notificationIdArray: notificationIdArray },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};
