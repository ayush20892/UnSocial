import { postType, userType } from "./types";

export const searchInFollowing = (
  loggedInUser: userType,
  userToSearch: userType
) => {
  return loggedInUser.following.find((user) => user._id === userToSearch._id);
};

export function getArrayMatch(a: postType[], b: postType[]) {
  var matches = [];
  for (var i = 0; i < a.length; i++) {
    for (var e = 0; e < b.length; e++) {
      if (a[i]._id === b[e]._id) matches.push(a[i]);
    }
  }
  return matches;
}

export const CheckInList = (list: postType[], value: string) => {
  if (list.length === 0) return false;
  const postPresent = list.find((item: postType) => item._id === value);
  return postPresent ? true : false;
};
