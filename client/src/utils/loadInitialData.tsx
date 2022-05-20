import { NavigateFunction } from "react-router-dom";
import { userDashboard } from "./networkCall/userCalls";
import { getAllPosts } from "./networkCall/postCalls";
import { login, logout } from "../features/user/userSlice";
import { loadPosts, toggleLoader } from "../features/post/postSlice";

type loadInitialDataProp = {
  dispatch: Function;
  navigate: NavigateFunction;
  setIsLoading: Function;
};

export default async function loadInitialData({
  dispatch,
  navigate,
  setIsLoading,
}: loadInitialDataProp) {
  const session: { userId: string } = JSON.parse(
    localStorage.getItem("session")!
  );
  setIsLoading(true);
  const data = await getAllPosts();
  if (data.success) dispatch(loadPosts(data.posts));

  if (session?.userId) {
    const userData = await userDashboard();

    if (userData!.success === false) {
      dispatch(logout());
      navigate("/landing", { replace: true });
    } else {
      dispatch(login(userData!.user));
    }
  }
  setIsLoading(false);
}
