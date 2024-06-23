import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "../components/loader/Loader";
import Form from "react-bootstrap/Form";
import { toast } from "sonner";
import { Button, Col, Row } from "react-bootstrap";

const ProfilePage = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [validated, setValidated] = useState(false);
  const [userData, setUserData] = useState({
    Nom: "",
    Prenom: "",
    Email: "",
    Role: "",
    photo: null,
    experience: "",
    prix: "",
    specialite: "",
    Numero: "",
    Adresse: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserData();
  }, [auth]);

  const fetchUserData = async () => {
    try {
      const response = await axiosPrivate.get(`/getUserData/${auth._id}`);
      setUserData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const imageUrl = userData?.photo
    ? `http://localhost:8000/images/${userData.photo}`
    : null;

  const validatePasswords = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!oldPassword) {
      errors.oldPassword = "L'ancien mot de passe est requis.";
    }
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas.";
      }
      if (!passwordRegex.test(newPassword)) {
        errors.newPassword =
          "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.";
      }
    }

    setPasswordErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    if (oldPassword.length > 0 || newPassword || confirmPassword) {
      validatePasswords();
    }
  }, [oldPassword, newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!validatePasswords()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (let key in userData) {
        formDataToSend.append(key, userData[key]);
      }
      formDataToSend.append("oldPassword", oldPassword);
      formDataToSend.append("newPassword", newPassword);
      console.log(formDataToSend);
      console.log(formDataToSend);
      const response = await axiosPrivate.put(
        `/updateUserData/${userData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server:", response.data);
      toast.success("Succès! Mise à jour du profil réussie.");

      setValidated(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response.data);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = name === "photo" ? files[0] : value;

    if (name === "photo" && files.length > 0) {
      const photoURL = URL.createObjectURL(files[0]); // convertir la photo en object url et l'afficher dans la photo
      setUserData((prevData) => ({
        ...prevData,
        [name]: files[0],
        photoURL: photoURL,
      }));
    } else if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  if (!userData.Role) {
    return <Loader />;
  }

  return (
    <div className="page-content page-container" id="page-content">
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-xl-8 col-md-12">
            <div className="card user-card-full">
              <div className="row m-l-0 m-r-0">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center text-white">
                    <div className="m-b-25 round">
                      <img
                        src={userData?.photoURL || imageUrl}
                        className="img-radius"
                        alt="User"
                        style={{
                          borderRadius: "50%",
                          width: "100px",
                          height: "100px",objectFit: "cover"
                        }}
                      />
                    </div>
                    <h6 className="f-w-600">
                      {userData?.Prenom} {userData?.Nom}
                    </h6>
                    <p>{userData?.Role}</p>
                    <i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                      Information
                    </h6>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                          <Form.Label htmlFor="prenom">Prénom*</Form.Label>
                          <Form.Control
                            type="text"
                            id="prenom"
                            name="Prenom"
                            value={userData?.Prenom}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez fournir un prénom valide.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label htmlFor="nom">Nom*</Form.Label>
                          <Form.Control
                            type="text"
                            id="nom"
                            name="Nom"
                            value={userData?.Nom}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez fournir un nom valide.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                          <Form.Label htmlFor="email">Email*</Form.Label>
                          <Form.Control
                            type="email"
                            id="email"
                            name="Email"
                            value={userData?.Email}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez fournir un email valide.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label htmlFor="photo">
                            Photo du profil*
                          </Form.Label>
                          <Form.Control
                            type="file"
                            id="photo"
                            name="photo"
                            onChange={handleChange}
                            accept="image/*"
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez fournir une photo.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                          <Form.Label htmlFor="Numero">Numéro*</Form.Label>
                          <Form.Control
                            type="text"
                            id="Numero"
                            name="Numero"
                            value={userData?.Numero}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez fournir un numéro valide.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label htmlFor="Adresse">Adresse*</Form.Label>
                          <Form.Control
                            type="text"
                            id="Adresse"
                            name="Adresse"
                            value={userData?.Adresse}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez fournir une adresse valide.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      {userData?.Role === "Expert" && (
                        <div>
                          <Row className="mb-3">
                            <Col>
                              <Form.Group md="6">
                                <Form.Label htmlFor="experience">
                                  Expérience*
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="experience"
                                  name="experience"
                                  value={userData?.experience}
                                  onChange={handleChange}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Veuillez fournir une expérience valide.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group md="6">
                                <Form.Label htmlFor="prix">
                                  Prix de consultation*
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="prix"
                                  name="prix"
                                  value={userData?.prix}
                                  onChange={handleChange}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Veuillez fournir un prix valide.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Form.Group md="12">
                              <Form.Label htmlFor="specialite">
                                Spécialité*
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="specialite"
                                name="specialite"
                                value={userData?.specialite}
                                onChange={handleChange}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Veuillez fournir une spécialité valide.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                      <Row className="mb-3">
                        <hr className="mt-4" />
                        <Form.Group as={Col} md="12">
                          <Form.Label htmlFor="oldPassword">
                            Mot de passe actuel*
                          </Form.Label>
                          <Form.Control
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={handleChange}
                            isInvalid={!!passwordErrors.oldPassword}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {passwordErrors.oldPassword ||
                              "Veuillez fournir un mot de passe valide."}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row className="border rounded-2 pb-3">
                        <Form.Group md="6">
                          <Form.Label htmlFor="newPassword">
                            Nouveau Mot de Passe
                          </Form.Label>
                          <Form.Control
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChange}
                            isInvalid={!!passwordErrors.newPassword}
                          />
                          <Form.Control.Feedback type="invalid">
                            {passwordErrors.newPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group md="6">
                          <Form.Label htmlFor="confirmPassword">
                            Confirmer le Mot de Passe
                          </Form.Label>
                          <Form.Control
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!passwordErrors.confirmPassword}
                          />
                          <Form.Control.Feedback type="invalid">
                            {passwordErrors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <div className="d-flex justify-content-end mt-3">
                        <Button
                          type="submit"
                          style={{ backgroundColor: "#1b2651" }}
                        >
                          Enregistrer
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
