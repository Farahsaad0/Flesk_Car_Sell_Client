import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Devenir.css";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

const Form = () => {
  const { auth } = useAuth();
  const [data, setData] = useState({
    spécialité: "",
    prix: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth._id) {
      setError("Vous devez vous connecter ou créer un compte pour envoyer cette demande.");
      return;
    }
    try {
      const response = await axios.post("/demandeExpert", {
        userId: auth._id,
        spécialité: data.spécialité,
        prix: data.prix,
        experience: data.experience,
      });
      console.log(response.data);
      setSuccessMessage("Votre demande a été envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande pour devenir expert :", error);
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_form_container">
        <div className="left">
          <h1>Bienvenue</h1>
          <Link to="/login">
            <button type="button" className="white_btn">
              Se connecter
            </button>
          </Link>
        </div>
        <div className="right">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Envoyez votre demande</h1>
            <input
              type="text"
              placeholder="Spécialité"
              name="spécialité"
              onChange={handleChange}
              value={data.spécialité}
              required
              className="input"
            />
            <input
              type="number"
              placeholder="prix par consultation"
              name="prix"
              onChange={handleChange}
              value={data.prix}
              required
              className="input"
            />
            <input
              type="number"
              placeholder="expérience"
              name="experience"
              onChange={handleChange}
              value={data.experience}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            {successMessage && <div className="success_msg">{successMessage}</div>}
            <button type="submit" className="green_btn">
              Demander
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
