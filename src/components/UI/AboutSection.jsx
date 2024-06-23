import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/about-section.css";
import aboutImg from "../../assets/all-images/cars-img/bmw-offer.png";

const AboutSection = ({ aboutClass }) => {
  return (
    <section
      className="about__section"
      style={
        aboutClass === "aboutPage"
          ? { marginTop: "0px" }
          : { marginTop: "280px" }
      }
    >
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__section-content">
              <h4 className="section__subtitle">À propos</h4>
              <h2 className="section__title">Bienvenue chez Flesk Car Cell </h2>
              <p className="section__description">
                Votre destination de confiance pour l'achat de voitures de
                qualité supérieure. Fondée avec une passion pour l'automobile et
                un engagement envers l'excellence du service à la clientèle,
                notre équipe chez FLESK Car s'efforce de rendre votre expérience
                d'achat de voiture aussi agréable et transparente que possible.
                Avec notre vaste sélection de véhicules soigneusement inspectés
                et notre approche personnalisée, nous sommes déterminés à vous
                aider à trouver la voiture parfaite qui répond à vos besoins et
                à votre style de vie. Chez Flesk Car Sell, nous ne vendons pas
                seulement des voitures, nous créons des expériences mémorables
                sur la route.
              </p>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Qualité
                  exceptionnelle garantie
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i>Service clientèle
                  personnalisé
                </p>
              </div>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Sélection
                  diversifiée impressionnante
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i>Expérience
                  mémorable sur route
                </p>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="about__img">
              <img src={aboutImg} alt="" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
