import React from "react";
import { Route, Switch } from "react-router-dom";
import { adminRoutes, authRoutes, shopRoutes, userRoutes } from "./paths";
//routeMethods
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
//pages
import NotFound from "../pages/notFound/NotFound";
import Layout from "../layout/Layout";
const Router = () => {
  return (
    <>
      <Switch>
        {shopRoutes.map((route) => (
          <Route key={route.path} exact path={route.path}>
            <Layout>
              <route.component />
            </Layout>
          </Route>
        ))}
        {authRoutes.map((route) => (
          <AuthRoute key={route.path} path={route.path}>
            <route.component />
          </AuthRoute>
        ))}
        {userRoutes.map((route) => (
          <ProtectedRoute key={route.path} exact path={route.path}>
            <Layout>
              <route.component />
            </Layout>
          </ProtectedRoute>
        ))}
        {adminRoutes.map((route) => (
          <AdminRoute key={route.path} path={route.path}>
            <route.component {...route.subRoutes} />
          </AdminRoute>
        ))}
        <Route>
          <NotFound>Oi doi oi day la dau @@ </NotFound>
        </Route>
      </Switch>
    </>
  );
};

export default Router;
