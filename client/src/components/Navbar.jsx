import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { CaretDownFill, Check2, PersonCircle } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/AuthSlice";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { changeLanguage } from "../store/slices/SettingsSlice";
import { translateText } from "../utils/translation";

function Header() {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  const handleLanguageChange = (lang) => {
    if (!lang) return;

    if (lang.toLowerCase() === "english") {
      dispatch(
        changeLanguage({
          name: "English",
          code: "EN",
        })
      );
    } else if (lang.toLowerCase() === "spanish") {
      dispatch(
        changeLanguage({
          name: "Spanish",
          code: "ES",
        })
      );
    }
  };
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg={isAdmin ? "dark" : "primary"}
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <Link to="/">
            {selectedLanguage &&
              translateText("Bus Booking", selectedLanguage.code)}{" "}
            {user &&
              (isAdmin
                ? `| ${
                    selectedLanguage &&
                    translateText("admin", selectedLanguage.code)
                  }`
                : `| ${
                    selectedLanguage &&
                    translateText("user", selectedLanguage.code)
                  }`)}
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Navbar.Text style={{ marginRight: "1rem" }}>
              <Link to="/">
                {selectedLanguage &&
                  translateText("Home", selectedLanguage.code)}
              </Link>
            </Navbar.Text>
            {!user && (
              <>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/login">
                    {selectedLanguage &&
                      translateText("Login", selectedLanguage.code)}
                  </Link>
                </Navbar.Text>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/signup">
                    {selectedLanguage &&
                      translateText("SignUp", selectedLanguage.code)}
                  </Link>
                </Navbar.Text>
              </>
            )}

            {user && isAdmin && (
              <>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/admin/dashboard">
                    {selectedLanguage &&
                      translateText("dashboard", selectedLanguage.code)}
                  </Link>
                </Navbar.Text>
              </>
            )}

            {user && !isAdmin && (
              <>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/user/dashboard">
                    {selectedLanguage &&
                      translateText("dashboard", selectedLanguage.code)}
                  </Link>
                </Navbar.Text>
              </>
            )}
          </Nav>

          <Nav>
            {user && (
              <>
                <Navbar.Text
                  className="d-flex align-items-center"
                  style={{ marginRight: "1rem" }}
                >
                  <PersonCircle className="me-2" /> {user.name} / {user.email}
                </Navbar.Text>
                <Button
                  variant="danger"
                  style={{ marginRight: "1rem", cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  {selectedLanguage &&
                    translateText("logout", selectedLanguage.code)}
                </Button>
              </>
            )}
          </Nav>

          <Dropdown onSelect={handleLanguageChange} className="p-0">
            <Dropdown.Toggle id="dropdown-language">
              <div className="d-flex flex-row gap-1 align-items-center">
                {selectedLanguage && selectedLanguage.code === "ES" ? (
                  <>
                    <img
                      src="http://purecatamphetamine.github.io/country-flag-icons/3x2/MX.svg"
                      alt="Spanish"
                      width={20}
                      height={20}
                    />
                    <span>ES</span>
                  </>
                ) : (
                  <>
                    <img
                      src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
                      alt="English"
                      width={20}
                      height={20}
                    />
                    <span>EN</span>
                  </>
                )}
                <CaretDownFill />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="english" as={"button"}>
                <div className="d-flex flex-row gap-1 align-items-center">
                  <img
                    src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
                    alt="English"
                    width={20}
                    height={20}
                  />
                  <span>English</span>
                  {selectedLanguage && selectedLanguage.code === "EN" && (
                    <Check2 className="fw-bold" size={18} color="blue" />
                  )}
                </div>
              </Dropdown.Item>
              <Dropdown.Item eventKey="spanish" as={"button"}>
                <div className="d-flex flex-row gap-1 align-items-center">
                  <img
                    src="http://purecatamphetamine.github.io/country-flag-icons/3x2/MX.svg"
                    alt="Spanish"
                    width={20}
                    height={20}
                  />
                  <span>Spanish</span>
                  {selectedLanguage && selectedLanguage.code === "ES" && (
                    <Check2 className="fw-bold" size={18} color="blue" />
                  )}
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
