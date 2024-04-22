import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProfilePage = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [userData, setUserData] = useState({
    Nom: "",
    Prenom: "",
    Email: "",
    Role: "",
    photo: null,
  });

  useEffect(() => {
    fetchUserData();
  }, [auth]);

  const fetchUserData = async () => {
    try {
      const response = await axiosPrivate.get(`/getUserData/${auth._id}`);
      setUserData(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur : ",
        error
      );
    }
  };
  
  const imageUrl = userData.photo ? `http://localhost:8000/images/${userData.photo}` : null;


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
  
      for (let key in userData) {
        formDataToSend.append(key, userData[key]);
      }
  
      const response = await axiosPrivate.put(
        `/updateUserData/${userData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Réponse du serveur:", response.data);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
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
  


  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   const newValue = name === "photo" ? files[0] : value;
  
  //   if (name === "photo" && files.length > 0) {
  //     const photoURL = URL.createObjectURL(files[0]);
  //     setUserData((prevData) => ({
  //       ...prevData,
  //       [name]: files[0],
  //       photoURL: photoURL,
  //     }));
  //   } else {
  //     setUserData((prevData) => ({
  //       ...prevData,
  //       [name]: newValue,
  //     }));
  //   }
  // };
  

  if (!userData) {
    return <div>Chargement en cours...</div>;
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
                    {/* {error && <div className="error-message">{error}</div>} */}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="role" className="m-b-10 f-w-600">
                            Rôle
                          </label>
                          <select
                            id="role"
                            name="Role"
                            value={userData.Role}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option value="Utilisateur">Utilisateur</option>
                            <option value="Expert">Expert</option>
                            <option value="Administrateur">Administrateur</option>
                          </select>
                        </div>
                        
                      </div>
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
