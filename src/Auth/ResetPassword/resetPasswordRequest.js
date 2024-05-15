import React, { useState } from "react";
import styles from "../Singup/styles.module.css";
import axios from "../../api/axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/resetPassword", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to reset password. Please try again later.");
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.signup_container}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2>Password Reset</h2>
          <div>
            {/* <label htmlFor="email">Email:</label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Adresse Email"
              className={styles.input}
              autoFocus
              style={{border:"1px solid #ddd"}}
            />
          </div>
          <button type="submit" className={styles.green_btn}>
            Reset Password
          </button>
        {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
