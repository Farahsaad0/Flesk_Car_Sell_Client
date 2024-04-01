import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import "../styles/CreateAdForm.css";

const CreateAdForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    marque: "",
    modele: "",
    annee: "",
    photo: null,
    sponsorship: "Gold",
    userId: userId,
    date: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      formDataToSend.append("date", new Date().toISOString());

      const response = await axios.post("http://localhost:8000/carAds", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Réponse du serveur:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      // Gérer les erreurs ici
    }
  };

  return (
    <div className="create-ad-form-container">
      <Form onSubmit={handleSubmit} className="create-ad-form" encType="multipart/form-data">
        <h2>Créer une annonce</h2>
        <FormGroup>
          <Label for="titre">Titre</Label>
          <Input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            placeholder="Titre de l'annonce"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description de l'annonce"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="prix">Prix</Label>
          <Input
            type="number"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            placeholder="Prix de l'annonce"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="marque">Marque</Label>
          <Input
            type="text"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            placeholder="Marque de l'annonce"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="modele">Modèle</Label>
          <Input
            type="text"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            placeholder="Modèle de l'annonce"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="annee">Année</Label>
          <Input
            type="number"
            name="annee"
            value={formData.annee}
            onChange={handleChange}
            placeholder="Année de l'annonce"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="date">Date</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="photo">Photo</Label>
          <Input
            type="file"
            name="photo"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </FormGroup>
        {formData.photo && (
          <div>
            <h3>Aperçu de l'image :</h3>
            <img src={URL.createObjectURL(formData.photo)} alt="Aperçu" />
          </div>
        )}
        <Button type="submit" color="primary">
          Créer annonce
        </Button>
      </Form>
    </div>
  );
};

export default CreateAdForm;
