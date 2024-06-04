import React, { useEffect, useState } from "react";
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
import useAuth from "../../hooks/useAuth";

const ExpertItem = ({ expert, carAdId, hiredExpertsForCar = [] }) => {
  const [modal, setModal] = useState(false);
  const { auth } = useAuth();
  const [disableExpert, setDisableExpert] = useState(false);

  const toggle = () => setModal(!modal);
  useEffect(() => {
    if (hiredExpertsForCar.includes(expert._id)) {
      setDisableExpert(true);
    }
  }, [hiredExpertsForCar]);

  if (!expert) {
    return <div>aucune expert a la moment!!</div>;
  }

  const imageUrl = expert.photo
    ? `http://localhost:8000/images/${expert.photo}`
    : null;

  const hireExpert = async () => {
    try {
      const clientId = auth._id;
      const expertId = expert._id;
      const carId = carAdId;
      const jobDescription = document.getElementById("jobDescription").value;

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

  console.log(hiredExpertsForCar);
  return (
    <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column mb-4">
      <div className="card bg-light d-flex flex-fill">
        <div className="card-header text-muted border-bottom-0">Expert</div>
        <div className="card-body pt-0">
          <div className="row">
            <div className="col-7">
              <h2 className="lead">
                <b>{`${expert.Nom} ${expert.Prenom}`}</b>
              </h2>
              <p className="text-muted text-sm">
                
                
                <span>
                  <b>Adresse:</b> {expert?.Adresse}
                </span>
                <br />
                <span>
                  <b>Téléphone:</b> {expert?.Numéro}
                </span>
                <br />
                <span>
                  <b>Prix:</b> {expert?.ExpertId?.prix} TND
                </span>
                <br />
                <span>
                  <b>Expérience:</b> {expert?.ExpertId?.experience} ans
                </span>
                <br/>
                <span>
                  <b>Spécialité:</b> {expert?.ExpertId?.specialite} 
                </span>
              </p>
            </div>
            <div className="col-5 text-center">
              <img
                src={imageUrl}
                alt="user-avatar"
                className="img-circle img-fluid"
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="text-right">
            <Button disabled={disableExpert} style={{backgroundColor:"#cd2028"}} className="btn btn-sm" onClick={toggle}>
              Demander
            </Button>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>
          Hire {expert?.Nom} {expert?.Prenom}
        </ModalHeader>
        <ModalBody>
          <p>Email: {expert?.Email}</p>
          <p>Spécialité: {expert?.ExpertId?.specialite}</p>
          <p>Expérience: {expert?.ExpertId?.experience} ans</p>
          <p>Prix: {expert?.ExpertId?.prix} DT</p>
          <Label for="jobDescription" sm={2}>
            Plus de détails :
          </Label>
          <Input id="jobDescription" name="text" type="textarea" />
        </ModalBody>
        <ModalFooter>
          <Button style={{backgroundColor:"#cd2028"}} onClick={hireExpert}>
            Confirmer la demande
          </Button>
          <Button  color="secondary" onClick={toggle}>
            Retour
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ExpertItem;
