import { Navigate, useLocation } from "react-router-dom";
import { Children } from "./types";

export function PrivateRoute({ children }: Children) {
  const session: { userId: string } = JSON.parse(
    localStorage.getItem("session")!
  );
  const location = useLocation();
  return session?.userId && session.userId !== null ? (
    children
  ) : (
    <Navigate state={{ from: location }} replace to="/landing" />
  );
}
