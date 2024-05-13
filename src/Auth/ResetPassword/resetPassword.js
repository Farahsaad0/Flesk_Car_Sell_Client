import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../Singup/styles.module.css";
import axios from "../../api/axios";

const ChangePassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      console.log(token + " << token");
      const response = await axios.put(`/changePassword/${token}`, {
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to reset password. Please try again later.");
    }
  };

  return (
    <div className={styles.signup_container}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <div>
          <input
            type="password"
            id="password"
            placeholder="Nouveau Mot de Passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            style={{ border: "1px solid #ddd" }}
          />
        </div>
        <div>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            placeholder="Confirmer le Mot de Passe"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
            style={{ border: "1px solid #ddd" }}
          />
        </div>
        <button type="submit"  className={styles.green_btn}>Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
