import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "../api/axios";
import "../styles/CreateAdForm.css";
import useAuth from "../hooks/useAuth";
import SponsorshipItem from "../components/sponsorship/SponsorshipItem";

const CreateAdForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const userId = auth._id;
  // const [open, setOpen] = useState(1);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [sponsorships, setSponsorships] = useState([]);
  const [sponsorship, setSponsorship] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    marque: "",
    modele: "",
    annee: "",
    location: "",
    photos: [null],
    sponsorship: "",
    utilisateur: userId,
  });

  useEffect(() => {
    fetchCarAdCache();
    fetchSponsorships();
    fetchInactivatedSponsorship();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const response = await axios.get("/sponsorships");
      setSponsorships(response.data);
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
    }
  };

  const fetchCarAdCache = async () => {
    try {
      const response = await axios.get(`/carAdCache/${userId}`);
      setFormData(response.data);
    } catch (error) {
      console.error();
    }
  };

  const fetchInactivatedSponsorship = async () => {
    try {
      const response = await axios.get(`/sponsorships/available/${userId}`);
      setSponsorship(response.data);
    } catch (error) {
      console.error();
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === "date" && value) {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      newValue = formattedDate;
    }
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

      photos.forEach((photo, index) => {
        formDataToSend.append(`photos`, photo);
      });
      // for (let key in formData) {
      //   if (key === "photos") {
      //     // Append each photo to FormData
      //     photos.forEach((photo, index) => {
      //       formDataToSend.append(`${key}[${index}]`, photo);
      //     });
      //   } else {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // }

      const response = await axios.post("/carAds", formDataToSend, {
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

  const handleSponsorshipChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      sponsorship: value,
    }));
  };

  const handlePhotosChange = (e) => {
    const { files } = e.target;
    const selectedPhotos = Array.from(files);

    setPhotos(selectedPhotos);
  };

  return (
    <div className="create-ad-form-container">
      <Form
        onSubmit={handleSubmit}
        className="create-ad-form"
        encType="multipart/form-data"
      >
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
          <Label for="location">Location</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="ou ete vous ?"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="photos">Photos</Label>
          <Input
            type="file"
            name="photos"
            onChange={handlePhotosChange}
            accept="image/*"
            multiple
            required
          />
        </FormGroup>
        {photos.length > 0 && (
          <FormGroup>
            <Label>Prévisualisation des photos:</Label>
            <Row>
              {photos.map((photo, index) => (
                <div key={index} className="photo-preview">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Prévisualisation ${index + 1}`}
                    style={{ maxWidth: "100%", marginBottom: "10px" }}
                  />
                </div>
              ))}
            </Row>
          </FormGroup>
        )}
        {sponsorship.length > 0 ? (
          <FormGroup>
            <Label for="sponsorshipSelect">Sponsorship Plan:</Label>
            <Input
              id="sponsorshipSelect"
              name="select"
              type="select"
              value={formData.sponsorship}
              onChange={handleSponsorshipChange}
            >
              <option value="">Sélectionnez un plan</option>
              {sponsorship.map((sponsorship) => (
                <option key={sponsorship._id} value={sponsorship._id}>
                  {sponsorship.sponsorship}
                </option>
              ))}
            </Input>
          </FormGroup>
        ) : (
          <Button color="primary" onClick={toggle}>
            sponsoriser
          </Button>
        )}

        <Button type="submit" color="" style={{backgroundColor:"#cd2028"}}>
          Créer annonce
        </Button>
      </Form>

      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Nos plans de sponsorships:</ModalHeader>
        <ModalBody>
          <Row>
            {sponsorships.map((sponsorship) => (
              <SponsorshipItem
                key={sponsorship._id}
                sponsorship={sponsorship}
                formData={formData}
              />
            ))}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CreateAdForm;
