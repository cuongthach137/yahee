import { Route, Redirect } from "react-router-dom";

// hooks
import useAuthentication from "../customHooks/useAuthentication";

const AdminRoute = ({ children, ...rest }) => {
  const { isAuthenticated, user } = useAuthentication();
  const role = user.role;
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated && role && role === "admin" ? (
          children
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
};
export default AdminRoute;
