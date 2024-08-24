import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./loading-spinner/LoadingSpinner";

function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && isAdmin) {
    return children;
  }
  navigate("/");
}

export default ProtectedAdminRoute;
