import React from "react";
import "../../styles/become-driver.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import driverImg from "../../assets/all-images/expert.jpeg";

const BecomeDriverSection = () => {
  return (
    <section className="become__driver">
      <Container>
        <Row>
          <Col lg="6" md="6" sm="12" className="become__driver-img">
            <img src={driverImg} alt="" className="w-100" />
          </Col>

          <Col lg="6" md="6" sm="12">
            <h2 className="section__title become__driver-title">
            Souhaitez-vous devenir un expert sur notre site ? Rejoignez-nous dès maintenant et commencez à gagner avec nous !
            </h2>

            <Link to="/demandez_un_poste_d_expert" className="btn become__driver-btn mt-4">
              <button className="btn become__driver-btn">
                Devenir Expert
              </button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BecomeDriverSection;
