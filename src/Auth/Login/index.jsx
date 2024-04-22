// import React, { useEffect, useRef, useState } from "react";
// import axios from "../../api/axios";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import styles from "./styles.module.css";
// import VerificationPage from "../Singup/verificationPage";
// import useAuth from "../../hooks/useAuth";

// const LOGIN_URL = "/login";

// const Login = () => {
//   const { setAuth, persist, setPersist } = useAuth();

//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from || { pathname: "/" };

//   const emailRef = useRef();
//   const pwdRef = useRef();

//   // const [data, setData] = useState({ Email: "", Password: "" });
//   // const [error, setError] = useState("");
//   const [isNotVerified, setIsNotVerified] = useState(false);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errMsg, setErrMsg] = useState("");

//   useEffect(() => {
//     emailRef.current.focus();
//   }, []);

//   // const handleChange = ({ currentTarget: input }) => {
//   //   setData({ ...data, [input.name]: input.value });
//   // };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await axios.post(LOGIN_URL, data);
//   //     const { _id, Nom, Prenom, Email, Role, token, Statut } = response.data;

//   //     if (Statut === "En attente") {
//   //       setError(
//   //         "Votre compte est en attente d'approbation par l'administrateur."
//   //       );
//   //     } else if (Statut === "Approuvé") {
//   //       // Stocker les détails de l'utilisateur dans le stockage local
//   //       localStorage.setItem(
//   //         "userData",
//   //         JSON.stringify({ _id, Nom, Prenom, Email, Role })
//   //       );
//   //       // Stocker le token d'authentification
//   //       localStorage.setItem("token", token);
//   //       // Redirection vers la page d'accueil après une connexion réussie
//   //       navigate("/");
//   //     }
//   //   } catch (error) {
//   //     if (
//   //       error.response &&
//   //       error.response.status >= 400 &&
//   //       error.response.status <= 500
//   //     ) {
//   //       setError(error.response.data);
//   //     } else {
//   //       setError("Une erreur s'est produite lors de la connexion.");
//   //     }
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         LOGIN_URL,
//         { email, password },
//         { withCredentials: true }
//       );
//       console.log(JSON.stringify(response?.data));
//       const accessToken = response?.data?.token;
//       // const Role = response?.data?.adminUser.Role;
//       const Nom = response?.data?.adminUser.Nom;
//       const Prenom = response?.data?.adminUser.Prenom;
//       const _id = response?.data?.adminUser._id;
//       // setAuth({ _id, Nom, Prenom, Email : email, password, Role, accessToken });
//       setAuth({ _id, Nom, Prenom, Email: email, accessToken });
//       // console.log(Role + "<<<< Role"); // ! ___for_debugging_only_REMEMBER_TO_DELETE_LATER___
//       setEmail("");
//       setPassword("");
//       navigate(from, { replace: true });
//     } catch (err) {
//       // setPassword("");
//       if (!err?.response) {
//         setErrMsg("No Server Response");
//       } else if (err.response?.status === 400) {
//         setErrMsg("Missing Email or Password");
//       } else {
//         setErrMsg(err.response.data.message);
//       }
//     }
//   };

//   const togglePersist = () => {
//     setPersist((prev) => !prev);
//   };

//   useEffect(() => {
//     localStorage.setItem("persist", persist);
//   }, [persist]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await axios.post(LOGIN_URL, data);
//   //     const { _id, Nom, Prenom, Email, Verified, Role, token, Statut } =
//   //       response.data;

//   //     if (Statut === "En attente") {
//   //       setError(
//   //         "Votre compte est en attente d'approbation par l'administrateur."
//   //       );
//   //     } else if (!Verified) {
//   //       setIsNotVerified(true);
//   //       // } else if (Statut === "Approuvé") {
//   //     } else {
//   //       // Stocker les détails de l'utilisateur dans le stockage local
//   //       localStorage.setItem(
//   //         "userData",
//   //         JSON.stringify({ _id, Nom, Prenom, Email, Role })
//   //       );
//   //       // Stocker le token d'authentification
//   //       localStorage.setItem("token", token);
//   //       // Redirection vers la page d'accueil après une connexion réussie
//   //       navigate("/");
//   //     }
//   //   } catch (error) {
//   //     if (
//   //       error.response &&
//   //       error.response.status >= 400 &&
//   //       error.response.status <= 500
//   //     ) {
//   //       setError(error.response.data);
//   //     } else {
//   //       setError("Une erreur s'est produite lors de la connexion.");
//   //     }
//   //   }
//   // };

//   return (
//     <div className={styles.login_container}>
//       {isNotVerified ? (
//         <VerificationPage
//           email={email}
//           onSuccess={() => setIsNotVerified(false)}
//         />
//       ) : (
//         <div className={styles.login_form_container}>
//           <div className={styles.left}>
//             <form className={styles.form_container} onSubmit={handleSubmit}>
//               <h1>Se Connecter</h1>
//               <input
//                 type="email"
//                 placeholder="example@example.com"
//                 name="Email"
//                 ref={emailRef}
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//                 required
//                 className={styles.input}
//               />
//               <input
//                 type="password"
//                 placeholder="Mot de passe "
//                 name="Password"
//                 ref={pwdRef}
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//                 required
//                 className={styles.input}
//               />
//               <div className="form-group" id="formBasicCheckbox">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="persist"
//                     onChange={togglePersist}
//                     checked={persist}
//                   />
//                   <label className="form-check-label" htmlFor="persist">
//                     Trust This Device
//                   </label>
//                 </div>
//               </div>
//               {errMsg && <div className={styles.error_msg}>{errMsg}</div>}
//               <button type="submit" className={styles.green_btn}>
//                 Se connecter
//               </button>
//             </form>
//           </div>
//           <div className={styles.right}>
//             <h1>Nouveau Compte?</h1>
//             <Link to="/signup">
//               <button type="button" className={styles.white_btn}>
//                 S'inscrire
//               </button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import VerificationPage from "../Singup/verificationPage";
import useAuth from "../../hooks/useAuth";

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
      const { token, User } = response.data;
      const { _id, Nom, Prenom, Role, photo } = User;

      setAuth({ _id, Nom, Prenom, Role, photo, Email: email, accessToken: token });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setErrMsg("No server response.");
      } else if (err.response.status === 400) {
        setErrMsg("Missing email or password.");
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
                    Trust This Device
                  </label>
                </div>
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
