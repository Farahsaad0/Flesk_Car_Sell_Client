import React, { useState } from "react";
import { Button, CardBody, CardText, CardTitle, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ExpertCard = ({ expert, carAdId, hireExpert }) => {
    const [modal, setModal] = useState(false);
  if (!expert) {
    return <div>aucun expert pour le moment !!</div>;
  }
  
  const toggle = () => setModal(!modal);

  const imageUrl = expert.photo ? `http://localhost:8000/images/${expert.photo}` : null;

  return (
    <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
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
              </p>
            </div>
            <div className="col-5 text-center">
              <img src={imageUrl} alt="user-avatar" className="img-circle img-fluid" />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="text-right">
            <Button color="primary" className="btn btn-sm" onClick={toggle}>
              Consulter
            </Button>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>
          Consulter {expert?.Nom} {expert?.Prenom}
        </ModalHeader>
        <ModalBody>
          <p>Email: {expert?.Email}</p>
          <p>Spécialité: {expert?.ExpertId?.spécialité}</p>
          <p>Expérience: {expert?.ExpertId?.experience} ans</p>
          <p>Prix: {expert?.ExpertId?.prix} DT</p>
          <Label for="jobDescription" >
            Plus de détails : 
             En tant qu'expert dans le domaine, je vous invite à explorer notre sélection et à envisager de bénéficier de mon expertise. N'hésitez pas à me choisir pour toute demande d'expertise, je suis à votre disposition pour répondre à vos besoins et vous accompagner dans votre recherche automobile.
          </Label>
          
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ExpertCard;
