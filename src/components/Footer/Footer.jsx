import React from "react";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

const quickLinks = [
  {
    path: "/about",
    display: "About",
  },

  

  {
    path: "/cars",
    display: "Nos voitures",
  },
  
  {
    path: "/Experts",
    display: "Nos Experts",
  },
  {
    path: "/DevenirExpert",
    display: "Demande d'expertise",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];
  

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="6" md="4" sm="12">
            <div className="logo footer__logo">
              <h1>
                <Link to="/home" className=" d-flex align-items-center gap-2">
                  <i className="ri-car-line"></i>
                  <span>
                    Rent Car <br /> Service
                  </span>
                </Link>
              </h1>
            </div>
            <p className="footer__logo-content">
            Flesk Car Sell ,Votre destination de confiance pour l'achat de voitures de qualité supérieure. Fondée avec une passion pour l'automobile et un engagement envers l'excellence du service à la clientèle, notre équipe chez FLESK Car s'efforce de rendre votre expérience d'achat de voiture aussi agréable et transparente que possible. Avec notre vaste sélection de véhicules soigneusement inspectés et notre approche personnalisée, nous sommes déterminés à vous aider à trouver la voiture parfaite qui répond à vos besoins et à votre style de vie. Chez AutoMondo, nous ne vendons pas seulement des voitures, nous créons des expériences mémorables sur la route.
            </p>
          </Col>

          <Col lg="2" md="4" sm="6"  className="ms-5">
            <div className="mb-4">
              <h5 className="footer__link-title">Lien Rapides</h5>
              <ListGroup>
                {quickLinks.map((item, index) => (
                  <ListGroupItem key={index} className="p-0 mt-3 quick__link">
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col lg="3" md="4" sm="6"  className="ms-5">
            <div className="mb-4">
              <h5 className="footer__link-title mb-4">Notre agence central</h5>
              <p className="office__info">Monastir , rue de la liberté </p>
              <p className="office__info">Tel: +216 55 555 555</p>

              <p className="office__info">Email: farah.saad505@gmail.com</p>

              <p className="office__info">Temps du travail: 24j/7</p>
            </div>
          </Col>

          {/* <Col lg="3" md="4" sm="12">
            <div className="mb-4">
              <h5 className="footer__link-title"></h5>
              <p className="section__description"></p>
              <div className="newsletter">
                <input type="email" placeholder="Email" />
                <span>
                  <i className="ri-send-plane-line"></i>
                </span>
              </div>
            </div>
          </Col> */}

          <Col lg="12">
            <div className="footer__bottom">
              <p className="section__description d-flex align-items-center justify-content-center gap-1 pt-4">
                <i className="ri-copyright-line"></i>Copyright {year}, Flesk car Sell , Developped by FLESK. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
