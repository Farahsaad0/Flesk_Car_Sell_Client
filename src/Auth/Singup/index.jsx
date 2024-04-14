import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import VerificationPage from "./verificationPage";
import styles from "./styles.module.css";

const Signup = () => {
  const [data, setData] = useState({
    Prenom: "",
    Nom: "",
    Email: "",
    Password: "",
    Role: "",
    Spécialité: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8000/register";
      // Inclure toujours le champ Role, même s'il est vide
      const postData = { 
        ...data, 
        Role: data.Role || "Utilisateur" 
      };
      const { data: res } = await axios.post(url, postData);
      setMsg(res.message);
  
      // Stocker l'ID de l'utilisateur dans le stockage local après l'inscription réussie
      localStorage.setItem("userId", res._id);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
    setIsRegistered(true); // Toujours exécuté après la soumission du formulaire
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
              <h1>Créer Compte</h1>
              <input
                type="text"
                placeholder="Prenom"
                name="Prenom"
                onChange={handleChange}
                value={data.Prenom}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Nom"
                name="Nom"
                onChange={handleChange}
                value={data.Nom}
                required
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                name="Email"
                onChange={handleChange}
                value={data.Email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                name="Password"
                onChange={handleChange}
                value={data.Password}
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
                    checked={data.Role === "Expert"}
                  />
                  Expert
                </label>
              </div>
              {data.Role === "Expert" && (
                <input
                  type="text"
                  placeholder="Spécialité"
                  name="Spécialité"
                  onChange={handleChange}
                  value={data.Spécialité}
                  required
                  className={styles.input}
                />
              )}
              {error && <div className={styles.error_msg}>{error}</div>}
              {msg && <div className={styles.success_msg}>{msg}</div>}
              <button type="submit" className={styles.green_btn}>
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
