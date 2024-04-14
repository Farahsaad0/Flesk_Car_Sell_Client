import React from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ car }) => {
  // Vérifiez si car est défini avant de tenter de le déstructurer
  if (!car) {
    return <div>mafamma chay!!</div>; // Ou tout autre composant de chargement ou message d'erreur approprié
  }

  const {
    titre,
    description,
    prix,
    marque,
    modele,
    annee,
    photo,
    sponsorship,
    date, // Ajout de la propriété dateCreation
  } = car;

  // Construire l'URL de l'image en utilisant la nouvelle structure
  const imageUrl = `http://localhost:8000/images/${photo}`;

  // Formater la date de création au format souhaité (par exemple, format de date standard)
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="car__item">
        <div className="car__img">
          <img src={imageUrl} alt={photo} className="w-100" />
        </div>

        <div className="car__item-content mt-4">
          <h4 className="section__title text-center">{titre}</h4>
          {/* Utilisez titre ici */}
          <p className="description">{description}</p>
          {/* Utilisez description ici */}
          <h6 className="rent__price text-center mt-">{prix}</h6>
          <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-car-line"></i> {marque} {modele}
              {/* Utilisez marque et modele ici */}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {annee}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-timer-flash-line"></i> {sponsorship}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-calendar-line"></i> Created on: {formattedDate}
            </span>
          </div>
          <Link to={`/cars/${car._id}`}>
            <button className=" w-50 car__item-btn car__btn-details">
              Details
            </button>
          </Link>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
