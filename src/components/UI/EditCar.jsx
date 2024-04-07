import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const EditCarAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carData, setCarData] = useState({
    titre: "",
    description: "",
    prix: 0,
    marque: "",
    modele: "",
    annee: 0,
    sponsorship: "",
    photo: null,
    date: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarAd = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/carAds/${id}`);
        setCarData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car ad:", error);
        setLoading(false);
      }
    };
    fetchCarAd();
  }, [id]);

  const imageUrl = `http://localhost:8000/images/${carData.photo}`;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = name === "photo" ? files[0] : value;

    setCarData((prevCarData) => ({
      ...prevCarData,
      [name]: newValue,
    }));

    if (name === "photo" && files.length > 0) {
      const photoURL = URL.createObjectURL(files[0]);
      setCarData((prevCarData) => ({
        ...prevCarData,
        photoURL: photoURL,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (let key in carData) {
        if (key === "photo" && carData[key] === null) {
          continue;
        }
        formDataToSend.append(key, carData[key]);
      }

      const response = await axios.put(
        `http://localhost:8000/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
      navigate(`/myads`);
    } catch (error) {
      console.error("Error updating car ad:", error);
    }
  };

  return (
    <div className="container">
      <h1>Modifier l'annonce</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="titre">Titre</Label>
            <Input
              type="text"
              name="titre"
              id="titre"
              value={carData.titre}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              style={{ height: "auto", minHeight: "100px" }}
              value={carData.description}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="prix">Prix</Label>
            <Input
              type="number"
              name="prix"
              id="prix"
              value={carData.prix}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="marque">Marque</Label>
            <Input
              type="text"
              name="marque"
              id="marque"
              value={carData.marque}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="modele">Modèle</Label>
            <Input
              type="text"
              name="modele"
              id="modele"
              value={carData.modele}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="sponsorship">Sponsorship</Label>
            <Input
              type="text"
              name="sponsorship"
              id="sponsorship"
              value={carData.sponsorship}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="annee">Année</Label>
            <Input
              type="number"
              name="annee"
              id="annee"
              value={carData.annee}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="photo">Photo</Label>
            <Input
              type="file"
              name="photo"
              id="photo"
              onChange={handleChange}
              accept="image/*"
            />
          </FormGroup>
          {carData.photo && (
            <div>
              <h3>Aperçu de l'image :</h3>
              <img
                src={carData.photoURL || imageUrl}
                alt="Aperçu"
                style={{ maxWidth: "100%", maxHeight: "250px" }}
              />
            </div>
          )}
          <Button color="primary" type="submit" className="mt-3">
            Modifier
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditCarAd;
