import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { useSelector } from "react-redux";

function ProtectedAdminRoute() {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");

    if (!isAdmin) return navigate("/");
  }, [navigate, user, isAdmin]);

  return <Outlet />;
}

export default ProtectedAdminRoute;
