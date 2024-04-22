import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile.css";

const ProfilePage = () => {
  const [updatedData, setUpdatedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Aucun token d'authentification disponible");
          return;
        }
        const response = await axios.get("http://localhost:8000/getUserData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpdatedData(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des données utilisateur");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token d'authentification disponible");
        setLoading(false);
        return;
      }

      // Si une nouvelle photo a été sélectionnée, téléchargez-la d'abord
      if (updatedData.photoFile) {
        await uploadPhoto();
      }

      // Une fois que la photo est téléchargée (ou si aucune nouvelle photo n'est sélectionnée),
      // mettez à jour le reste des informations du profil
      const response = await axios.put(
        `http://localhost:8000/updateUserData/${updatedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdatedData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors de la soumission du formulaire");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedData({
          ...updatedData,
          photo: reader.result,
          photoFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("photo", updatedData.photoFile);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/updateUserData/${updatedData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUpdatedData({ ...updatedData, photo: response.data.photoUrl });
      setLoading(false);
    } catch (error) {
      setError("Erreur lors du téléchargement de l'image");
      setLoading(false);
    }
  };

  if (!updatedData) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="page-content page-container" id="page-content">
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-xl-6 col-md-12">
            <div className="card user-card-full">
              <div className="row m-l-0 m-r-0">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center text-white">
                    <div className="m-b-25">
                      {updatedData.photo ? (
                        <img
                          src={updatedData.photo}
                          className="img-radius"
                          alt="User-Profile-Image"
                        />
                      ) : (
                        <p>Aucune image sélectionnée</p>
                      )}
                    </div>
                    <h6 className="f-w-600">
                      {updatedData.Nom} {updatedData.Prenom}
                    </h6>
                    <p>{updatedData.Role}</p>
                    <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                      Information
                    </h6>
                    {error && <div className="error-message">{error}</div>}
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
                            value={updatedData.Nom}
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
                            value={updatedData.Prenom}
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
                            value={updatedData.Email}
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
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="role" className="m-b-10 f-w-600">
                            Rôle
                          </label>
                          <select
                            id="role"
                            name="Role"
                            value={updatedData.Role}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option value="Utilisateur">Utilisateur</option>
                            <option value="Expert">Expert</option>
                            <option value="Administrateur">Administrateur</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="photo" className="m-b-10 f-w-600">
                            Photo de profil
                          </label>
                          <input
                            type="file"
                            id="photo"
                            name="photo"
                            onChange={handleImageChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      {updatedData.photo && (
                        <div>
                          <h3>Aperçu de l'image :</h3>
                          <img
                            src={updatedData.photo}
                            alt="Aperçu"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                      )}
                      <div className="row mt-3">
                        <div className="col-sm-12">
                          <button type="submit" className="btn btn-primary" disabled={loading}>
                            Enregistrer
                          </button>
                        </div>
                      </div>
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
