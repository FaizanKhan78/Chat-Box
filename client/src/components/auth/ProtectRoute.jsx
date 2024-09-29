import { Navigate, Outlet } from "react-router-dom";
import useProfile from "../../hooks/useProfile";

const ProtectRoute = ({ children, user, redirect = "/login" }) => {
  useProfile();
  if (!user) {
    return <Navigate to={redirect} />;
  } else {
    return children ? children : <Outlet />;
  }
};

export default ProtectRoute;
