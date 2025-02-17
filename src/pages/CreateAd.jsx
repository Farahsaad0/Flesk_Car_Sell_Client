import React, { useEffect, useRef, useState } from "react";
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
  Progress,
} from "reactstrap";
import axios from "../api/axios";
import "../styles/CreateAdForm.css";
import useAuth from "../hooks/useAuth";
import SponsorshipItem from "../components/sponsorship/SponsorshipItem";
import * as cv from "../opencv/opencv";

import useOpenCV from "../hooks/useOpenCV"; // Import the useOpenCV hook
import Utils from "../assets/utils";
import { toast } from "sonner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const CreateAdForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const userId = auth._id;
  // const [open, setOpen] = useState(1);
  const [modal, setModal] = useState(false);
  const canvasRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  let licensePlateCascade = null;
  const toggle = () => setModal(!modal);

  const [sponsorships, setSponsorships] = useState([]);
  const [sponsorship, setSponsorship] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    marque: "",
    modele: "",
    annee: "",
    location: "",
    kilometrage: "",
    vitesse: "",
    photos: [null],
    sponsorship: "",
    utilisateur: userId,
  });
  // const isReady = useOpenCV("opencv"); // Check if OpenCV.js is ready
  // const utils = new Utils("errorMessage"); // Initialize Utils class

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
      toast.error(
        "Un erreur s'est produite lors de la récupération des données des packs de sponsorship valables"
      );
    }
  };

  const fetchCarAdCache = async () => { // pour s'il y a cache sera affiché
    try {
      const response = await axiosPrivate.get(`/carAdCache/${userId}`);
      setFormData(response.data);
    } catch (error) {
      console.error();
    }
  };

  const fetchInactivatedSponsorship = async () => { // recherche s'il ya sponsor payer mais pas activé
    try {
      const response = await axiosPrivate.get(`/sponsorships/available/${userId}`);
      if (response && response.data && response.data.length > 0) {
        setSponsorship(response.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          sponsorship: response.data[0]._id,
        }));
      }
    } catch (error) {
      console.log("error: ", error);
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

      if (photos.length > 0) {
        photos.forEach((photo, index) => {
          formDataToSend.append(`photos`, photo);
        });
      }

      const response = await axiosPrivate.post("/carAds", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Réponse du serveur:", response.data);
      toast.success("Votre annonce a été crée avec succès.");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      toast.error(
        "Un erreur s'est produite lors de la création de votre annonce"
      );
    }
  };

  const handleSponsorshipChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      sponsorship: value,
    }));
  };

  // const handlePhotosChange = async (e) => {
  //   const { files } = e.target;
  //   const selectedPhotos = Array.from(files);

  //   setPhotos(selectedPhotos);
  // };

  // Function to load the cascade file asynchronously
  const loadCascadeFile = async (xmlURL) => {
    return new Promise((resolve, reject) => {
      console.log("111111111111");
      let licensePlateCascade = new cv.CascadeClassifier();
      console.log("222222222222");
      const utils = new Utils("errorMessage");
      try {
        utils.createFileFromUrl(xmlURL, xmlURL, () => {
          console.log("33333333333");
          try {
            if (licensePlateCascade.load(xmlURL)) {
              console.log("44444444444");
              console.log("Haar Cascade XML file loaded successfully.");
              resolve(licensePlateCascade);
            } else {
              throw new Error("Failed to load Haar Cascade XML file.");
            }
          } catch (error) {
            console.error("Error loading Haar Cascade XML file:", error);
            reject(error);
          }
        });
      } catch (error) {
        console.error("Error creating File From Url:", error);
        reject(error);
      }
    });
  };
  // Function to process a single image
  const processImage = async (file, licensePlateCascade) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          console.log("Image loaded successfully.");
          const image = new Image();
          image.src = reader.result;
          image.onload = async () => {
            console.log("Converting image to grayscale...");
            const src = cv.imread(image);
            const gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            console.log("Detecting license plates...");
            const plates = new cv.RectVector();
            const msize = new cv.Size(0, 0);
            licensePlateCascade.detectMultiScale(
              gray,
              plates,
              1.1,
              3,
              0,
              msize,
              msize
            );

            console.log("Applying Gaussian blur to detected plates...");
            for (let i = 0; i < plates.size(); ++i) {
              try {
                const plate = plates.get(i);
                const roi = src.roi(plate);
                cv.GaussianBlur(
                  roi,
                  roi,
                  new cv.Size(23, 23),
                  40,
                  40,
                  cv.BORDER_DEFAULT
                );
                roi.delete();
              } catch (error) {
                console.error("Error applying Gaussian blur to plate:", error);
              }
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            console.log("Displaying the result...");
            cv.imshow(canvasRef.current, src);

            // Convert the processed image to a Blob
            canvasRef.current.toBlob((blob) => {
              resolve(blob);
            });

            // Clean up
            src.delete();
            gray.delete();
            plates.delete();
          };
        } catch (error) {
          console.error("Error processing image:", error);
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  // Function to handle photos change and process each photo
  const handlePhotosChange = async (e) => {  
    const { files } = e.target;
    const selectedPhotos = Array.from(files);
    const xmlURL = "cascade_number_woaen.xml";

    // Check if XML file has been loaded before proceeding
    if (licensePlateCascade === null) {
      console.log(licensePlateCascade);
      console.log("XML file has not been loaded yet. Loading...");
      try {
        licensePlateCascade = await loadCascadeFile(xmlURL);
      } catch (error) {
        console.error("Error loading Haar Cascade XML file:", error);
        return;
      }
    }
    try {
      console.log("Starting license plate detection...");
      // const xmlURL = "cascade_numero_uno.xml";

      // Load the cascade file once before processing all images
      // const licensePlateCascade = await loadCascadeFile(xmlURL);

      const processedPhotos = await Promise.all(
        selectedPhotos.map(async (file, index) => {
          try {
            const processedBlob = await processImage(file, licensePlateCascade);
            setProgress(((index + 1) / selectedPhotos.length) * 100);
            return processedBlob;
          } catch (error) {
            console.error("Error processing image:", error);
            return null;
          }
        })
      );

      // Filter out any null values (in case of errors)
      const validProcessedPhotos = processedPhotos.filter( 
        (photo) => photo !== null
      );

      console.log(licensePlateCascade);
      setPhotos(validProcessedPhotos);
    } catch (error) {
      console.error("Error initializing license plate detection:", error);
    }
    cv.FS_unlink(xmlURL, xmlURL);
    setProgress(0);
  };

  // const handlePhotosChange = async (e) => {
  //   const { files } = e.target;
  //   const selectedPhotos = Array.from(files);

  //   try {
  //     console.log("Starting license plate detection...");
  //     // Jarab Loadi el cascade file 9bal ma tebda  tprocessi tsawer
  //     const xmlURL = "cascade_numero_uno.xml";
  //     let licensePlateCascade = await loadCascadeFile(xmlURL);

  //     const processedPhotos = await Promise.all(
  //       selectedPhotos.map(async (file) => {
  //         try {
  //           const processedBlob = await processImage(file, licensePlateCascade);
  //           return processedBlob;
  //         } catch (error) {
  //           console.error("Error processing image:", error);
  //           return null;
  //         }
  //       })
  //     );

  //     const validProcessedPhotos = processedPhotos.filter(
  //       (photo) => photo !== null
  //     );

  //     setPhotos(validProcessedPhotos);
  //   } catch (error) {
  //     console.error("Error initializing license plate detection:", error);
  //   }
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
            placeholder="Description du véhicule"
            style={{ maxHeight: "20rem" }}
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
            placeholder="Prix "
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
            placeholder="Marque"
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
            placeholder="Modèle de véhicule"
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
            placeholder="Année de fabrication"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="kilometrage">Kilométrage (en km)</Label>
          <Input
            type="number"
            name="kilometrage"
            value={formData.kilometrage}
            onChange={handleChange}
            placeholder="kilométrage totale de véhicle"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="vitesse">Vitesse (en km/h)</Label>
          <Input
            type="number"
            name="vitesse"
            value={formData.vitesse}
            onChange={handleChange}
            placeholder="Vitesse maximal de véhicule"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="location">Localisation</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Votre adresse exacte ?"
            required
          />
        </FormGroup>
        {/* <FormGroup>
          <Label for="photos">Photos</Label>
          <Input
            type="file"
            name="photos"
            onChange={handlePhotosChange}handleLicensePlateDetection
            accept="image/*"
            multiple
            required
          />
        </FormGroup> */}
        <FormGroup>
          <Label for="licensePlateImage">
            Image du véhicule avec floutage de plaque d'immatriculation
          </Label>
          <Input
            type="file"
            name="licensePlateImage"
            id="licensePlateImage"
            accept="image/*"
            onChange={handlePhotosChange} // Call the license plate detection function
            multiple
            required
          />
        </FormGroup>
        <canvas
          ref={canvasRef}
          id="canvas"
          style={{ width: "100%", display: "none" }}
        ></canvas>
        {/* progress bar here */}
        {progress > 0 && (
          <Progress value={progress}>{Math.round(progress)}%</Progress>
        )}
        {photos.length > 0 && (
          <FormGroup>
            <Label>Prévisualisation des photos:</Label>
            <Row>
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className=" col-12 col-sm-6 col-md-4  photo-preview"
                  style={{ alignContent: "center" }}
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Prévisualisation ${index + 1}`}
                    style={{
                      backgroundColor: "#eee",
                      objectFit: "contain",
                      maxWidth: "100%",
                      marginBottom: "10px",
                    }}
                  />
                </div>
              ))}
            </Row>
          </FormGroup>
        )}
        {sponsorship.length > 0 ? (
          <FormGroup>
            <Label for="sponsorshipSelect">Nos Pack sponsor:</Label>
            <Input
              id="sponsorshipSelect"
              name="select"
              type="select"
              value={formData.sponsorship}
              onChange={handleSponsorshipChange}
            >
              {sponsorship.map((sponsorship) => (
                <option
                  key={sponsorship._id}
                  value={sponsorship._id}
                  defaultValue
                >
                  {sponsorship.sponsorship}
                </option>
              ))}
            </Input>
          </FormGroup>
        ) : (
          <Button
            onClick={toggle}
            className="golden_border"
            style={{ color: "#1a1a1a" }}
          >
            sponsoriser
          </Button>
        )}
        <Button type="submit" color="" style={{ backgroundColor: "#cd2028" }}>
          Créer annonce
        </Button>
      </Form>

      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Nos pack sponsor:</ModalHeader>
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
