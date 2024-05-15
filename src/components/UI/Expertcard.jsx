import React, { useState } from "react";
import { Button, CardBody, CardText, CardTitle, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la navigation

const ExpertCard = ({ expert }) => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate(); // Obtention de la fonction de navigation

  const handleClick = () => {
    if (expert) {
      // Navigation vers la page du profil de l'expert avec les données de l'expert passées
      navigate("/expertprofile", { state: { expert } });
    }
  };
  
  

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
            <Button color="primary" className="btn btn-sm"onClick={handleClick} >
              Voir Profil
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ExpertCard;
