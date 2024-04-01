import React from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ car }) => {
  // Vérifiez si car est défini avant de tenter de le déstructurer
  if (!car) {
    return <div>mafamma chay ya 5ra</div> ; // Ou tout autre composant de chargement ou message d'erreur approprié
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
  } = car;

  // Construire l'URL de l'image en utilisant la nouvelle structure
  const imageUrl = `/public/uploads/${photo}`;


  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="car__item">
        <div className="car__img">
          <img src={imageUrl} alt={marque} className="w-100" />
        </div>

        <div className="car__item-content mt-4">
          <h4 className="section__title text-center">{titre}</h4>{" "}
          {/* Utilisez titre ici */}
          <p className="description">{description}</p>{" "}
          {/* Utilisez description ici */}
          <h6 className="rent__price text-center mt-">
            {prix}.00 
          </h6>
          <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-car-line"></i> {marque} {modele}{" "}
              {/* Utilisez marque et modele ici */}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {annee}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-timer-flash-line"></i> {sponsorship}
            </span>
          </div>
          <button className=" w-50 car__item-btn car__btn-rent">
            <Link to={`/cars/${car._id}`}>Rent</Link>
          </button>
          <button className=" w-50 car__item-btn car__btn-details">
            <Link to={`/cars/${car._id}`}>Details</Link>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
