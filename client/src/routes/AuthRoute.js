import { Route, Redirect, useLocation } from "react-router-dom";

// hooks
import useAuthentication from "../customHooks/useAuthentication";

// pages

// ----------------------------------------------------------------------

const AuthRoute = ({ children, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthentication();
  return (
    <Route
      {...rest}
      render={() =>
        !isAuthenticated ? (
          children
        ) : user.role === "admin" ? (
          <Redirect to={{ pathname: "/admin/app" }} />
        ) : (
          <Redirect
            to={{ pathname: location.state ? location.state.from : "/" }}
          />
        )
      }
    />
  );
};
export default AuthRoute;
