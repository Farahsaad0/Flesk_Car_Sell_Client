import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "../../api/axios";
import { toast } from "sonner";

const VerificationPage = ({ email, onSuccess }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const url = "/verify";

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, {
        email,
        verificationCode,
      });
      toast.success(res.message);
      onSuccess(); // Appel à la fonction onSuccess pour signaler la réussite de la vérification
      navigate("/login"); // Rediriger vers la page de connexion après la vérification réussie
    } catch (error) {
      toast.error("Code de vérification invalide.");
    }
  };

  const resendVerificationCode = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      const { data: res } = await axios.post("/resendVerificationCode", {
        email,
      });
      toast.success(res.message);
    } catch (error) {
      toast.error("Erreur lor de la re-envoi de la code de vérification.");
    }
    setSending(false)
  };

  return (
    <div className={styles.signup_container}>
      <form
        className={styles.form_container}
        onSubmit={handleVerificationSubmit}
      >
        <h1>Vérification de l'email</h1>
        <input
          type="text"
          placeholder="Code de vérification"
          name="verificationCode"
          onChange={(e) => setVerificationCode(e.target.value)}
          value={verificationCode}
          required
          className={styles.input}
          style={{ border: "1px solid #ccc" }}
        />
        <div className="form-group" id="formBasicCheckbox">
          <span
            className={styles.resendVerificationCode}
            id="resendVerificationCode"
            onClick={resendVerificationCode}
          >
            Renvoyer le code de vérification
          </span>
          {sending && <span className="fw-light"> en cours...</span>}
        </div>
        {/* {error && <div className={styles.error_msg}>{error}</div>}
        {msg && <div className={styles.success_msg}>{msg}</div>} */}
        <button type="submit" className={styles.green_btn}>
          Valider
        </button>
      </form>
    </div>
  );
};

export default VerificationPage;
