import React, { useState } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
// import AuthContext from "../../context/AuthProvider";

const LOGIN_URL = "/login";

const Login = () => {
  // const { setAuth } = useContext(AuthContext);

  const [data, setData] = useState({ Email: "", Password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(LOGIN_URL, data);
  //     const { _id, Nom, Prenom, Email, Role, token, Statut } = response.data;

  //     if (Statut === "En attente") {
  //       setError(
  //         "Votre compte est en attente d'approbation par l'administrateur."
  //       );
  //     } else if (Statut === "Approuvé") {
  //       // Stocker les détails de l'utilisateur dans le stockage local
  //       localStorage.setItem(
  //         "userData",
  //         JSON.stringify({ _id, Nom, Prenom, Email, Role })
  //       );
  //       // Stocker le token d'authentification
  //       localStorage.setItem("token", token);
  //       // Redirection vers la page d'accueil après une connexion réussie
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     if (
  //       error.response &&
  //       error.response.status >= 400 &&
  //       error.response.status <= 500
  //     ) {
  //       setError(error.response.data);
  //     } else {
  //       setError("Une erreur s'est produite lors de la connexion.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, data);
      const { _id, Nom, Prenom, Email, Role, token, Statut } = response.data;

      if (Statut === "En attente") {
        setError(
          "Votre compte est en attente d'approbation par l'administrateur."
        );
      } else if (Statut === "Approuvé") {
        // Stocker les détails de l'utilisateur dans le stockage local
        localStorage.setItem(
          "userData",
          JSON.stringify({ _id, Nom, Prenom, Email, Role })
        );
        // Stocker le token d'authentification
        localStorage.setItem("token", token);
        // Redirection vers la page d'accueil après une connexion réussie
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data);
      } else {
        setError("Une erreur s'est produite lors de la connexion.");
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Se Connecter</h1>
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
              placeholder="Mot de passe "
              name="Password"
              onChange={handleChange}
              value={data.Password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Se connecter
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Nouveau Compte?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              S'inscrire
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
