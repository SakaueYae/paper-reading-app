import { Navigate } from "react-router";
import { useAuthContext } from "./AuthProvider";

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return <div>Now Loading...</div>;

  console.log(user);

  return user ? children : <Navigate to="/signin" replace />;
};
