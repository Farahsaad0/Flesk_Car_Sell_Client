import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/profile.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    Nom: '',
    Prenom: '',
    Email: '',
    Password: '',
    Role: 'Utilisateur'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token d\'authentification disponible');
          return;
        }
        const response = await axios.get('http://localhost:8000/getUserData', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur : ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token d\'authentification disponible');
        return;
      }
      const response = await axios.put("http://localhost:8000/updateUserData/:id", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Réponse du serveur:', response.data);
      setUserData(updatedData); // Mettre à jour les données utilisateur dans le frontend avec les nouvelles données modifiées
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  if (!userData) {
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
                      <img src="https://img.icons8.com/bubbles/100/000000/user.png" className="img-radius" alt="User-Profile-Image" />
                    </div>
                    <h6 className="f-w-600">{userData.Nom} {userData.Prenom}</h6>
                    <p>{userData.Role}</p>
                    <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="nom" className="m-b-10 f-w-600">Nom</label>
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
                          <label htmlFor="prenom" className="m-b-10 f-w-600">Prénom</label>
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
                          <label htmlFor="email" className="m-b-10 f-w-600">Email</label>
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
                          <label htmlFor="password" className="m-b-10 f-w-600">Password</label>
                          <input
                            type="password"
                            id="password"
                            name="Password"
                            value={updatedData.Password}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="role" className="m-b-10 f-w-600">Rôle</label>
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
                      </div>
                      <button type="submit" className="btn btn-primary mt-3">Enregistrer</button>
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
