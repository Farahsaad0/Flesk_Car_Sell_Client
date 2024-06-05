import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import axios from "axios";

import "../styles/contact.css";
import { toast } from "sonner";

// const socialLinks = [
//   {
//     url: "#",
//     icon: "ri-facebook-line",
//   },
//   {
//     url: "#",
//     icon: "ri-instagram-line",
//   },
//   {
//     url: "#",
//     icon: "ri-linkedin-line",
//   },
//   {
//     url: "#",
//     icon: "ri-twitter-line",
//   },
// ];

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
        "http://localhost:8000/contacts",
        formData
      );
      console.log(response.data);
      toast.success(
        "Merci de nous avoir contactés ! Nous avons bien reçu votre message et vous répondrons bientôt"
      );
      // Réinitialisez le formulaire après avoir envoyé les données avec succès
      setFormData({ Nom: "", Prénom: "", Email: "", Message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Un erreur s'est produite lors de l'envoi de votre message")
    }
  };

  return (
    <Helmet title="Contact">
      <CommonSection title="Contact" />
      <section>
        <Container>
          <Row>
            <Col lg="7" md="7">
              <h6 className="fw-bold fs-3 mb-4">Contacter nous</h6>

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

                <Button className=" contact__btn" type="submit">
                  Envoyer Message
                </Button>
              </Form>
            </Col>

            <Col lg="5" md="5">
              <div className="contact__info">
                <h6 className="fw-bold fs-3">Nos Informations de Contact</h6>
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
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Contact;
