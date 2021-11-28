import { Redirect, Route } from "react-router-dom";

// hooks
import useAuthentication from "../customHooks/useAuthentication";

// pages

// ----------------------------------------------------------------------

export default function ProtectedRoute({ children, ...rest }) {
  const { isAuthenticated } = useAuthentication();

  return (
    <Route
      {...rest}
      exact
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{ pathname: "/auth/login", state: { from: location.pathname } }}
          />
        )
      }
    />
  );
}
