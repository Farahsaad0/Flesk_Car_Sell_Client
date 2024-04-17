import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/header.css";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/cars",
    display: "Cars",
  },
  {
    path: "/blogs",
    display: "Blog",
  },
  {
    path: "/contact",
    display: "Contact",
  },
  {
    path: "/myads",
    display: "Mes annonces",
  },
  {
    path: "/demande",
    display: "Demande d'expertise",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:8000/getUserData",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserData(response.data);
          setUserRole(response.data.Role);
          setIsLoggedIn(true);
          console.log("User role:", response.data.Role); // Ajout de la console.log
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de la connexion de l'utilisateur :",
          error
        );
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  return (
    <header className="header">
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
                <span>Need Help?</span>
                <span className="header__top__help">
                  <i className="ri-phone-fill"></i> +216-50 400 500
                </span>
              </div>
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="d-flex align-items-center gap-1 profile_icon"
                    >
                      <i className="ri-user-line"></i>
                      {userData && userData.Nom && userData.Prenom
                        ? `${userData.Nom} ${userData.Prenom}`
                        : "Profile"}
                    </Link>
                    <button onClick={handleLogout} className="btn btn-link">
                      Déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className=" d-flex align-items-center gap-1"
                    >
                      <i className="ri-login-circle-line"></i> Login
                    </Link>
                    <Link
                      to="/signup"
                      className=" d-flex align-items-center gap-1"
                    >
                      <i className="ri-user-line"></i> Register
                    </Link>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className=" d-flex align-items-center gap-2">
                    <i className="ri-car-line"></i>
                    <span>
                      FLESK Car <br /> Sell
                    </span>
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-earth-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Monastir</h4>
                  <h6>Rue Liberté, Monastir</h6>
                </div>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-time-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>temp de travail</h4>
                  <h6>24h/7j</h6>
                </div>
              </div>
            </Col>

            <Col
              lg="2"
              md="3"
              sm="0"
              className=" d-flex align-items-center justify-content-end "
            >
              <button className="header__btn btn ">
                <Link to="/contact">
                  <i className="ri-phone-line"></i> Request a call
                </Link>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => {
                  console.log("isLoggedIn:", isLoggedIn);
                  console.log("userRole:", userRole);
                  console.log("item.path:", item.path);
                  if (
                    userRole === "Expert" &&
                    item.path === "/demande"
                  ) {
                    console.log("case one ____________________________")
                    return (
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "nav__active nav__item" : "nav__item"
                        }
                        key={index}
                      >
                        {item.display}
                      </NavLink>
                    );
                  } else if (
                    !isLoggedIn &&
                    (item.path === "/myads" || item.path === "/demande")
                  ) {
                    return null;
                    
                  } else if (
                    isLoggedIn && userRole !== "Expert" && item.path === "/demande"
                  ) {
                    return null;
                  } else {
                    return (
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "nav__active nav__item" : "nav__item"
                        }
                        key={index}
                      >
                        {item.display}
                      </NavLink>
                    );
                  }
                  
                  
                })}
              </div>
            </div>
            <div className="nav__right">
              <div className="search__box">
                <input type="text" placeholder="Search" />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
