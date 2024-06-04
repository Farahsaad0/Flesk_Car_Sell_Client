import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Devenir.css";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { toast } from "sonner";

const ApplyForAnExpertRoleForm = () => {
  const { auth } = useAuth();
  const [data, setData] = useState({
    specialite: "",
    prix: "",
    experience: "",
    documents: null,
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

  const handleFileChange = (e) => {
    setData((prevData) => ({
      ...prevData,

      documents: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth._id) {
      setError(
        "Vous devez vous connecter ou créer un compte pour envoyer cette demande."
      );
      return;
    }
    try {
      const formData = new FormData(); // Create a new FormData instance

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]); // Append each field to the formData
      });

      const response = await axios.post(
        "/demandeExpert",
        {
          userId: auth._id,
          specialite: data.specialite,
          prix: data.prix,
          documents: data.documents,
          experience: data.experience,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // const response = await axios.post("/demandeExpert", {
      //   userId: auth._id,
      //   specialite: data.specialite,
      //   prix: data.prix,
      //   experience: data.experience,
      // });
      console.log(response.data);
      // setSuccessMessage("Votre demande a été envoyée avec succès !");
      toast.success("Votre demande a été envoyée avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de la demande pour devenir expert :",
        error
      );
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
              name="specialite"
              onChange={handleChange}
              value={data.specialite}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="prix par consultation"
              name="prix"
              onChange={handleChange}
              value={data.prix}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="expérience"
              name="experience"
              onChange={handleChange}
              value={data.experience}
              required
              className="input"
            />
            <input
              type="file"
              placeholder="Document de Confiance"
              name="documents"
              onChange={handleFileChange}
              // value={data.documents}
              required
              className={"input"}
            />
            {error && <div className="error_msg">{error}</div>}
            {successMessage && (
              <div className="success_msg">{successMessage}</div>
            )}
            <button type="submit" className="green_btn">
              Demander
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyForAnExpertRoleForm;
