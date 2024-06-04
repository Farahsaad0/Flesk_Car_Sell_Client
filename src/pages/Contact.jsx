import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import axios from "axios";

import "../styles/contact.css";

const socialLinks = [
  {
    url: "#",
    icon: "ri-facebook-line",
  },
  {
    url: "#",
    icon: "ri-instagram-line",
  },
  {
    url: "#",
    icon: "ri-linkedin-line",
  },
  {
    url: "#",
    icon: "ri-twitter-line",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    Nom: "",
    Prénom: "",
    Email: "",
    Message: "",
  });

  const { Nom, Prénom, Email, Message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/contact",
        formData
      );
      console.log(response.data);
      // Réinitialisez le formulaire après avoir envoyé les données avec succès
      setFormData({ Nom: "", Prénom: "", Email: "", Message: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Helmet title="Contact">
      <CommonSection title="Contact" />
      <section>
        <Container>
          <Row>
            <Col lg="7" md="7">
              <h6 className="fw-bold mb-4">Contacter nous</h6>

              <Form onSubmit={handleSubmit}>
                <FormGroup className="contact__form">
                  <Input
                    name="Nom"
                    placeholder=" Nom "
                    type="text"
                    value={Nom}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup className="contact__form">
                  <Input
                    name="Prénom"
                    placeholder=" Prénom"
                    type="text"
                    value={Prénom}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup className="contact__form">
                  <Input
                    name="Email"
                    placeholder="Email"
                    type="email"
                    value={Email}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup className="contact__form ">
                  <Input
                    type="textarea"
                    name="Message"
                    rows="5"
                    placeholder="Message"
                    className="textarea"
                    value={Message}
                    onChange={handleChange}
                  />
                </FormGroup>

                <button className=" contact__btn" type="submit">
                  Send Message
                </button>
              </Form>
            </Col>

            <Col lg="5" md="5">
              <div className="contact__info">
                <h6 className="fw-bold">Nos Informations de Contact</h6>
                <p className="section__description mb-0">
                  Monastir , Rue Liberté
                </p>
                <div className=" d-flex align-items-center gap-2">
                  <h6 className="fs-6 mb-0">Numéro de Téléphone:</h6>
                  <p className="section__description mb-0">+216 56937619</p>
                </div>

                <div className=" d-flex align-items-center gap-2">
                  <h6 className="mb-0 fs-6">Email:</h6>
                  <p className="section__description mb-0">
                    Farah.saad505@gmail.com
                  </p>
                </div>

                <h6 className="fw-bold mt-4">Follow Us</h6>

                <div className=" d-flex align-items-center gap-4 mt-3">
                  {socialLinks.map((item, index) => (
                    <Link
                      to={item.url}
                      key={index}
                      className="social__link-icon"
                    >
                      <i className={item.icon}></i>
                    </Link>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Contact;
