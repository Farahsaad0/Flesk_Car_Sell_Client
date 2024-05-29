import React from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/car-item.css";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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
    photos,
    date, // Ajout de la propriété dateCreation
  } = car;
  const firstPhoto = photo || photos[0];
  // Construire l'URL de l'image en utilisant la nouvelle structure
  const imageUrl = `http://localhost:8000/images/${firstPhoto}`;

  // Formater la date de création au format souhaité (par exemple, format de date standard)
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <Col lg="3" md="4" sm="6" className="mb-2 ">
      <div className={`car__item ${car.sponsorship?.sponsorshipStatus ===  "active" && car.sponsorship?.features.includes("Annonce mise en avant") ? "golden_border" : ""}`}>
        <Link to={`/cars/${car._id}`}>
          <div
            className="car__img"
            style={{
              width: "100%",
              height: 0,
              paddingBottom: "100%",
              position: "relative",
              overflow: "hidden",
              background: "#ddd",
            }}
          >
            <img
              src={imageUrl}
              alt={firstPhoto}
              className="w-100 h-100 position-absolute "
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        <div className="car__item-content mt-4">
          <h4 className="section__title text-center" style={{ height: "2.5em", overflowY: "auto" }}>{titre}</h4>
          {/* Utilisez titre ici */}
          <div
            className="description-container"
            style={{ height: "3em", overflowY: "auto" }}
          >
            <p className="description">{description}</p>
          </div>

          {/* Utilisez description ici */}
          <h6 className="rent__price text-center mt-">{prix}</h6>
          <div className="car__item-info d-flex flex-wrap align-items-center justify-content-between mt-3 mb-4">
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-car-line"></i> {marque} {modele}
              {/* Utilisez marque et modele ici */}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {annee}
            </span>
            {/* <span className=" d-flex align-items-center gap-1">
              <i className="ri-timer-flash-line"></i> {sponsorship}
            </span> */}
            <span className=" d-flex align-items-center gap-1">
              {/* <i className="ri-calendar-line"></i>{formatDistanceToNow(formattedDate, { locale: fr })} */}
              
            </span>
          </div>
          <Link to={`/cars/${car._id}`} className="car__item__button__wrapper">
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
