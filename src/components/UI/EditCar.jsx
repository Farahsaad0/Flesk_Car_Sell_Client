import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Row } from "reactstrap";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../loader/Loader";
import * as cv from "../../opencv/opencv";
import Utils from "../../assets/utils";

const EditCarAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const canvasRef = useRef(null);

  let licensePlateCascade = null;

  const [photos, setPhotos] = useState([]);
  const [carData, setCarData] = useState({
    titre: "",
    description: "",
    prix: 0,
    marque: "",
    modele: "",
    annee: 0,
    sponsorship: "",
    photos: [null],
    date: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarAd = async () => {
      try {
        const response = await axios.get(`/carAds/details/${id}`);
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

      // Append new processed photos if they exist
      if (photos.length > 0) {
        photos.forEach((photo, index) => {
          formDataToSend.append(`photos`, photo);
        });
      }

      const response = await axiosPrivate.put(
        `carAd/update/${id}`,
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

  // Function to load the cascade file asynchronously
  const loadCascadeFile = async (xmlURL) => {
    return new Promise((resolve, reject) => {
      console.log("111111111111");
      licensePlateCascade = new cv.CascadeClassifier();
      console.log("222222222222");
      const utils = new Utils("errorMessage");
      try {
        utils.createFileFromUrl(
          xmlURL,
          "http://localhost:3000/cascade_numero_uno.xml",
          () => {
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
          }
        );
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
    const xmlURL = "cascade_numero_uno.xml";

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
        selectedPhotos.map(async (file) => {
          try {
            const processedBlob = await processImage(file, licensePlateCascade);
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
  };

  return (
    <div className="container w-50 my-5">
      <h1>Modifier l'annonce</h1>
      {loading ? (
        <Loader />
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
              onChange={handlePhotosChange}
              accept="image/*"
              multiple
            />
          </FormGroup>{" "}
          <canvas
            ref={canvasRef}
            id="canvas"
            style={{ width: "100%", display: "none" }}
          ></canvas>
          <h3>Aperçu de l'image :</h3>
          <Row>
            {photos.length > 0
              ? photos.map((photo, index) => (
                  <div
                    key={index}
                    className=" col-12 col-sm-6 col-md-4 "
                    style={{ alignContent: "center" }}
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Aperçu"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#eee",
                        objectFit: "contain",
                        marginBottom: "10px",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                ))
              : carData.photos.map((photo, index) => (
                  <div
                    key={index}
                    className=" col-12 col-sm-6 col-md-4 "
                    style={{ alignContent: "center" }}
                  >
                    <img
                      src={
                        carData.photoURL ||
                        `http://localhost:8000/images/${photo}`
                      }
                      alt="Aperçu"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#eee",
                        objectFit: "contain",
                        marginBottom: "10px",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                ))}
          </Row>
          <Button color="primary" type="submit" className="mt-3">
            Modifier
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditCarAd;
