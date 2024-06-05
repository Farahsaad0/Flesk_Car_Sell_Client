import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import VerificationPage from "../Singup/verificationPage";
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";

const LOGIN_URL = "/login";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: "/" };

  const emailRef = useRef();
  const pwdRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isNotVerified, setIsNotVerified] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.User.Verified === false) {
        setIsNotVerified(true);

        return;
      }
      const { token, User } = response.data;
      const { _id, Nom, Prenom, Role, photo } = User;

      setAuth({
        _id,
        Nom,
        Prenom,
        Role,
        photo,
        Email: email,
        accessToken: token,
      });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setErrMsg("No server response.");
      } else if (err.response.status === 400) {
        setErrMsg("Missing email or password.");
      } else if (err.response.status === 429) {
        console.log(err.response);
        console.log(err.response);
        console.log(err.response);
        toast.error(err.response.data.message);
      } else {
        setErrMsg("Invalid email or password.");
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className={styles.login_container}>
      {isNotVerified ? (
        <VerificationPage
          email={email}
          onSuccess={() => setIsNotVerified(false)}
        />
      ) : (
        <div className={styles.login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Se Connecter</h1>
              <input
                type="email"
                placeholder="example@example.com"
                name="email"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                name="password"
                ref={pwdRef}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className={styles.input}
              />
              <div className="form-group" id="formBasicCheckbox">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="persist"
                    onChange={togglePersist}
                    checked={persist}
                  />
                  <label className="form-check-label" htmlFor="persist">
                    rester connecté (24h)
                  </label>
                </div>
              </div>
              <div className={styles.link_container}>
                <Link to="/requestPasswordReset">Mot de passe oublié ?</Link>
              </div>
              {errMsg && <div className={styles.error_msg}>{errMsg}</div>}
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
      )}
    </div>
  );
};

export default Login;
