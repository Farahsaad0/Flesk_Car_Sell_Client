import React, { useState } from "react";
import {
  Badge,
  Button,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import "../../styles/car-item.css";
import axios from "../../api/axios";

const ExpertItem = ({ expert, carAdId }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  if (!expert) {
    return <div>aucune expert a la moment!!</div>;
  }

  const hireExpert = async () => {
    try {
      const { _id: clientId } = JSON.parse(
        localStorage.getItem("userData")
      );
      const expertId = expert._id;
      const carId = carAdId;
      const jobDescription = document.getElementById("jobDescription").value;
      // const paymentStatus = "pending";

      const response = await axios.post("/createJob", {
        clientId,
        expertId,
        carId,
        jobDescription,
      });

      if (response.data.success) {
        console.log("Job created successfully:", response.data.data);
        toggle(); // Close the modal
      } else {
        console.error("Failed to create job:", response.data.error);
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <CardBody>
        <CardTitle tag="h5">{`${expert.Nom} ${expert.Prenom}`}</CardTitle>
        <CardText>
          <Badge color="info" className="me-2">
            Spécialité: {expert?.ExpertId?.spécialité}
          </Badge>
          <Badge color="success" className="me-2">
            Expérience: {expert?.ExpertId?.experience} ans
          </Badge>
          <Badge color="primary" className="me-2">
            Prix: {expert?.ExpertId?.prix} TND
          </Badge>
        </CardText>
        <CardText>Email: {expert.Email}</CardText>
        <Button color="primary" className="float-end" onClick={toggle}>
          Hire
        </Button>
      </CardBody>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>
          Hire {expert?.Nom} {expert?.Prenom}
        </ModalHeader>
        <ModalBody>
          <p>Email: {expert?.Email}</p>
          <p>Spécialité: {expert?.ExpertId?.spécialité}</p>
          <p>Expérience: {expert?.ExpertId?.experience} ans</p>
          <p>Prix: {expert?.ExpertId?.prix} DT</p>
          <Label for="jobDescription" sm={2}>
            plus details:
          </Label>
          <Input id="jobDescription" name="text" type="textarea" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={hireExpert}>
            Confirm Hire
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Col>
  );
};

export default ExpertItem;
