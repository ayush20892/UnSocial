type imageType = {
  id: string;
  secure_url: string;
};

type replyType = {
  _id: string;
  user: userType;
  reply: string;
};

export type commentType = {
  _id: string;
  user: userType;
  comment: string;
  replies: replyType[];
};

export type postType = {
  _id: string;
  textContent: string;
  image?: imageType;
  userId: userType;
  likes: userType[];
  comments: commentType[];
};

export type userType = {
  _id: string;
  name: string;
  userName: string;
  email: string;
  role: string;
  bio: string;
  profilePicture: imageType;
  following: userType[];
  followers: userType[];
  posts: postType[];
  likedPosts: postType[];
  bookmarkedPosts: postType[];
  archivePosts: postType[];
  notification: notificationType[];
};

export type notificationType = {
  _id: string;
  fromUser: userType;
  toUser: userType;
  type: string;
  isRead: boolean;
  post?: postType;
};

export type Children = { children: React.ReactElement };

export type InputEvent = React.ChangeEvent<HTMLInputElement>;

export type likePayload = {
  post: postType;
  user: userType;
};

export type commentPayload = {
  post: postType;
  comment: commentType;
};

export type deleteCommentPayload = {
  post: postType;
  commentId: string;
};

export type actionMenuType = {
  action: string;
  actionFunction: Function;
};
