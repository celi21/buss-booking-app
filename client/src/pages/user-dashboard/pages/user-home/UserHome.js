import React from "react";
import { useSelector } from "react-redux";

const UserHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <h3>Welcome Back! {user.name}</h3>
    </div>
  );
};

export default UserHome;
