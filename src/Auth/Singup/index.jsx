import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VerificationPage from "./verificationPage";
import styles from "./styles.module.css";
import { toast } from "sonner";
import axios from "../../api/axios";

const Signup = () => {
  const [data, setData] = useState({
    Prenom: "",
    Nom: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Role: "",
    Numero: "",
    Adresse: "",
    Specialite: "",
    prix: "",
    experience: "",
    documents: null,
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? (checked ? value : "") : value;

    setData((prevData) => ({
      ...prevData,
      [name]: newValue,
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
    if (data.Password !== data.ConfirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    console.log(data.Password);
    if (!passwordRegex.test(data.Password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre."
      );
      return;
    }

    try {
      const url = "/register";
      // const postData = {
      //   ...data,
      //   Role: data.Role || "Utilisateur",
      // };
      // const response = await axios.post(url, postData);
      const formData = new FormData(); // Create a new FormData instance

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]); // Append each field to the formData
      });

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        setIsRegistered(true);
      } else {
        toast.error("Registration est échoué.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration a échoué. try again.");
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      {isRegistered ? (
        <VerificationPage
          email={data.Email}
          onSuccess={() => navigate("/login")}
        />
      ) : (
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>Bienvenue</h1>
            <Link to="/login">
              <button type="button" className={styles.white_btn}>
                Se connecter
              </button>
            </Link>
          </div>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1 className="mt-4">Créer Compte</h1>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <input
                  style={{ width: "49%" }}
                  type="text"
                  placeholder="Prenom"
                  name="Prenom"
                  onChange={handleChange}
                  value={data.Prenom}
                  className={styles.input}
                  required
                />

                <input
                  style={{ width: "49%" }}
                  type="text"
                  placeholder="Nom"
                  name="Nom"
                  onChange={handleChange}
                  value={data.Nom}
                  className={styles.input}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Adresse Email"
                name="Email"
                onChange={handleChange}
                value={data.Email}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Numéro de téléphone"
                name="Numero"
                onChange={handleChange}
                value={data.Numero}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Votre Adresse"
                name="Adresse"
                onChange={handleChange}
                value={data.Adresse}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Mot de passe (8 caractères, maj., min., chiffre)"
                name="Password"
                onChange={handleChange}
                value={data.Password}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                name="ConfirmPassword"
                onChange={handleChange}
                value={data.ConfirmPassword}
                required
                className={styles.input}
              />
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="Role"
                    value="Expert"
                    onChange={handleChange}
                  />
                  Expert
                </label>
              </div>
              {data.Role === "Expert" && (
                <>
                  <input
                    type="text"
                    placeholder="Specialite"
                    name="Specialite"
                    onChange={handleChange}
                    value={data.Specialite}
                    required
                    className={styles.input}
                  />
                  <input
                    type="number"
                    placeholder="Prix par consultation"
                    name="prix"
                    onChange={handleChange}
                    value={data.prix}
                    required
                    className={styles.input}
                  />
                  <input
                    type="number"
                    placeholder="Expérience (années)"
                    name="experience"
                    onChange={handleChange}
                    value={data.experience}
                    required
                    className={styles.input}
                  />
                  <input
                    type="file"
                    placeholder="Document de Confiance"
                    name="documents"
                    onChange={handleFileChange}
                    // value={data.documents}
                    required
                    className={styles.input}
                  />
                </>
              )}
              {error && <div className={styles.error_msg}>{error}</div>}
              {msg && <div className={styles.success_msg}>{msg}</div>}
              <button type="submit" className={`${styles.green_btn} mb-4`}>
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
