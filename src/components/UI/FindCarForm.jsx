import React, { useState } from "react";
import { Form, FormGroup } from "reactstrap";
import axios from "axios";
import CarItem from "./CarItem"; // Importer le composant CarItem
import "../../styles/find-car-form.css";

const FindCarForm = ({ cars }) => {
  // États de formulaire pour chaque critère de recherche
  const [adresse, setAdresse] = useState("");
  const [marque, setMarque] = useState("");
  const [date, setDate] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [anneeMin, setAnneeMin] = useState("");
  const [anneeMax, setAnneeMax] = useState("");
  const [modele, setModele] = useState("");
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche

  // Fonction de recherche des annonces de voiture
  const searchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8000/carAds/search", {
        params: {
          marque: marque || undefined,
          modele: modele || undefined,
          date: date || undefined,
          prixFrom: prixMin || undefined,
          prixTo: prixMax || undefined,
          anneeFrom: anneeMin || undefined,
          anneeTo: anneeMax || undefined,
          adresse: adresse || undefined,
        },
      });
      setSearchResults(response.data); // Mettre à jour les résultats de la recherche
    } catch (error) {
      console.error(
        "Erreur lors de la recherche des annonces de voiture :",
        error
      );
      setSearchResults([]); // Réinitialiser les résultats de la recherche en cas d'erreur
    }
  };

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    searchCars(); // Appeler la fonction de recherche lors de la soumission du formulaire
  };

  // Rendu du formulaire de recherche
  return (
    <Form className="form" onSubmit={handleSubmit}>
      <div className=" d-flex align-items-center justify-content-between flex-wrap">
        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="Adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="Marque"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            className="journey__time"
            type="number"
            placeholder="Prix min"
            value={prixMin}
            onChange={(e) => setPrixMin(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            className="journey__time"
            type="number"
            placeholder="Prix max"
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            className="journey__time"
            type="number"
            placeholder="Année min"
            value={anneeMin}
            onChange={(e) => setAnneeMin(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            className="journey__time"
            type="number"
            placeholder="Année max"
            value={anneeMax}
            onChange={(e) => setAnneeMax(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="Modèle"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form__group">
          <button type="submit" className="btn find__car-btn">
            Rechercher
          </button>
        </FormGroup>
      </div>

      {/* Afficher les résultats de la recherche */}
      <div className="row">
        {searchResults.map((car) => (
          <CarItem key={car._id} car={car} />
        ))}
      </div>
    </Form>
  );
};

export default FindCarForm;
