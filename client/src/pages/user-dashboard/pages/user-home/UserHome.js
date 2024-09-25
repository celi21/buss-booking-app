import React from "react";
import { useSelector } from "react-redux";
import { translateText } from "../../../../utils/translation";

const UserHome = () => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <h3>
        {selectedLanguage &&
          translateText("Welcome Back", selectedLanguage.code)}{" "}
        {user.name}
      </h3>
    </div>
  );
};

export default UserHome;
