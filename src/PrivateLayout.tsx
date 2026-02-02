import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type{ RootState } from "./store";
import React from "react";

const PrivateLayout = () => {
  const isAuth = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateLayout;
