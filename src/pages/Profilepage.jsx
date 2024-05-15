import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "../components/loader/Loader";
import { toast } from "sonner"; // Import toast function

const ProfilePage = () => {
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    photo: null,
    experience: "",
    prix: "",
    spécialité: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState(""); // Add old password state

  useEffect(() => {
    fetchUserData();
  }, [auth]);

  const fetchUserData = async () => {
    try {
      const response = await axiosPrivate.get(`/getUserData/${auth._id}`);

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const imageUrl = userData?.photo
    ? `http://localhost:8000/images/${userData.photo}`
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    try {
      if (!oldPassword) {
        toast.error("Error! Old password is required.");
        return;
      }
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("Error! Passwords do not match.");
          return;
        }
        if (!passwordRegex.test(newPassword)) {
          toast.error(
            "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre."
          );
          return;
        }
      }
      const formDataToSend = new FormData();

      for (let key in userData) {
        formDataToSend.append(key, userData[key]);
      }
      formDataToSend.append("oldPassword", oldPassword);
      formDataToSend.append("newPassword", newPassword);
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
      // Show success toast
      toast.success("Success! Profile updated successfully.");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error toast
      toast.error("Error! Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = name === "photo" ? files[0] : value;

    if (name === "photo" && files.length > 0) {
      const photoURL = URL.createObjectURL(files[0]);
      setUserData((prevData) => ({
        ...prevData,
        [name]: files[0],
        photoURL: photoURL,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  if (!userData) {
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
                    <div className="m-b-25">
                      <img
                        src={userData.photoURL || imageUrl}
                        className="img-radius"
                        alt="User"
                      />
                    </div>
                    <h6 className="f-w-600">
                      {userData.Nom} {userData.Prenom}
                    </h6>
                    <p>{userData.Role}</p>
                    <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                      Information
                    </h6>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="nom" className="m-b-10 f-w-600">
                            Nom
                          </label>
                          <input
                            type="text"
                            id="nom"
                            name="Nom"
                            value={userData.Nom}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="prenom" className="m-b-10 f-w-600">
                            Prénom
                          </label>
                          <input
                            type="text"
                            id="prenom"
                            name="Prenom"
                            value={userData.Prenom}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="email" className="m-b-10 f-w-600">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="Email"
                            value={userData.Email}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="Password" className="m-b-10 f-w-600">
                            Mot de passe actuel*
                          </label>
                          <input
                            type="password"
                            id="Password"
                            name="Password"
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label
                            htmlFor="newPassword"
                            className="m-b-10 f-w-600"
                          >
                            Nouveau Mot de Passe*
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="NewPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label
                            htmlFor="confirmPassword"
                            className="m-b-10 f-w-600"
                          >
                            Confirmer le Mot de Passe*
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="NewPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      {userData.Role === "Expert" && (
                        <div>
                          <div className="row">
                            <div className="col-sm-6">
                              <label
                                htmlFor="experience"
                                className="m-b-10 f-w-600"
                              >
                                Expérience
                              </label>
                              <input
                                type="text"
                                id="experience"
                                name="experience"
                                value={userData.experience}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                            <div className="col-sm-6">
                              <label htmlFor="prix" className="m-b-10 f-w-600">
                                Prix
                              </label>
                              <input
                                type="text"
                                id="prix"
                                name="prix"
                                value={userData.prix}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-12">
                              <label
                                htmlFor="spécialité"
                                className="m-b-10 f-w-600"
                              >
                                Spécialité
                              </label>
                              <input
                                type="text"
                                id="spécialité"
                                name="spécialité"
                                value={userData.spécialité}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="photo" className="m-b-10 f-w-600">
                            Photo
                          </label>
                          <input
                            type="file"
                            id="photo"
                            name="photo"
                            onChange={handleChange}
                            className="form-control"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary mt-3">
                        Enregistrer
                      </button>
                    </form>
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
