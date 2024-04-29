import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Row,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "../api/axios";
import "../styles/CreateAdForm.css";
import useAuth from "../hooks/useAuth";
import SubscriptionItem from "../components/subscription/SubscriptionItem";

const CreateAdForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const userId = auth._id;
  // const [open, setOpen] = useState(1);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [subscriptions, setSubscriptions] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    marque: "",
    modele: "",
    annee: "",
    photo: null,
    sponsorship: "Gold",
    utilisateur: userId,
    date: "",
  });

  useEffect(() => {
    fetchCarAdCache();
    fetchSubscriptions();
    fetchInactivatedSponsorship();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/subscriptions");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
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
      setSponsorships(response.data);
    } catch (error) {
      console.error();
    }
  };
  // const toggle = (id) => {
  //   if (open === id) {
  //     setOpen();
  //   } else {
  //     setOpen(id);
  //     // fetchExperts();
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = value;
    if (type === "date" && value) {
      // Format the date to match backend requirements, for example: YYYY-MM-DD
      const formattedDate = new Date(value).toISOString().split("T")[0];
      newValue = formattedDate;
    }

    newValue = type === "file" ? files[0] : value;
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

  // const toggle = () => {
  //   setIsOpen(!isOpen);
  // };

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
            <img
              src={URL.createObjectURL(formData.photo)}
              alt="Aperçu"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}

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
            {sponsorships.map((sponsorship) => (
              <option key={sponsorship._id} value={sponsorship._id}>
                {sponsorship.sponsorship}
              </option>
            ))}
          </Input>
        </FormGroup>
        <Button color="primary" onClick={toggle}>
          Open
        </Button>
        {/* <Accordion flush open={open} toggle={toggle} className="mt-5">
          <AccordionItem>
            <AccordionHeader targetId="1">Consulter des Expert</AccordionHeader>
            <AccordionBody accordionId="1">
              <Row> */}
        {/* {expertsLoading ? (
                      <div>Loading...</div>
                    ) : (
                      experts.map((expert) => (
                        <ExpertItem key={expert._id} expert={expert} carAdId={id} />
                      ))
                    )} */}
        {/* </Row>
            </AccordionBody>
          </AccordionItem>
        </Accordion> */}

        <Button type="submit" color="primary">
          Créer annonce
        </Button>
      </Form>
      {/* <Offcanvas isOpen={isOpen} toggle={toggle} style={{ minWidth: "600px" }}>
        <OffcanvasHeader toggle={toggle}>Our sponsorship Plans: </OffcanvasHeader>
        <OffcanvasBody>
          {subscriptions.map((subscription) => (
            <SubscriptionItem
              key={subscription._id}
              subscription={subscription}
              refreshSubscriptions={fetchSubscriptions}
            />
          ))}
        </OffcanvasBody>
      </Offcanvas> */}

      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Nos plans de sponsorships:</ModalHeader>
        <ModalBody>
          <Row>
            {subscriptions.map((subscription) => (
              <SubscriptionItem
                key={subscription._id}
                subscription={subscription}
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
