import React from "react";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import AboutSection from "../components/UI/AboutSection";
import { Container, Row, Col } from "reactstrap";
import BecomeDriverSection from "../components/UI/BecomeDriverSection";

import driveImg from "../assets/all-images/drive.jpg";
import OurMembers from "../components/UI/OurMembers";
import "../styles/about.css";

const About = () => {
  return (
    <Helmet title="About">
      <CommonSection title="About Us" />
      <AboutSection aboutClass="aboutPage" />

      <section className="about__page-section">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12">
              <div className="about__page-img">
                <img src={driveImg} alt="" className="w-100 rounded-3" />
              </div>
            </Col>

            <Col lg="6" md="6" sm="12">
              <div className="about__page-content">
                <h2 className="section__title">
                Des Expertises de Voiture Fiables : Notre Engagement envers la Transparence et la Confiance
                </h2>

                <p className="section__description">
                Chez FLESK, nous comprenons l'importance de faire un choix éclairé lors de l'achat ou de la vente d'une voiture. C'est pourquoi nous mettons à votre disposition une équipe d'experts dévoués, spécialisés dans l'évaluation minutieuse des véhicules. Nos experts qualifiés réalisent des expertises approfondies et fournissent des rapports détaillés, offrant une vue complète de l'état et de la valeur de chaque voiture. 
                </p>

                <p className="section__description">
                Grâce à leur expertise et à leur expérience, vous pouvez avoir une confiance totale dans les informations que nous vous fournissons. Que vous soyez acheteur ou vendeur, notre engagement est de vous offrir une expérience transparente et fiable, où chaque détail compte. Faites confiance à nos experts pour vous guider dans votre parcours automobile avec assurance et tranquillité d'esprit.
                </p>

                <div className="d-flex align-items-center gap-3 mt-4">
    <span className="fs-4">
        <i className="ri-phone-line"></i>
    </span>
    <div>
        <h6 className="section__subtitle">Besoin d'aide ?</h6>
        <h4>+216 55 555 555</h4>
    </div>
    <a href="/contact" className="btn btn-primary">Contactez-nous</a>
</div>

</div>
            </Col>
          </Row>
        </Container>
      </section>

      <BecomeDriverSection />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">Experts</h6>
              <h2 className="section__title">Our Members</h2>
            </Col>
            <OurMembers />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default About;
