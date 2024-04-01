import React from "react";
import { useNavigate } from "react-router-dom";


const CreateAdPage = () => {
  const navigate = useNavigate();

  const handleCreateAd = () => {
    const userId = localStorage.getItem("userId"); // Récupérer l'ID de l'utilisateur depuis le stockage local
    navigate("/create-ad", { state: { userId } }); // Passer l'ID de l'utilisateur lors de la navigation
  };

  return (
    <div>
      <h1>Créer une annonce</h1>
      <button onClick={handleCreateAd}>Créer une annonce</button>
    

    </div>
  );
};

export default CreateAdPage;
