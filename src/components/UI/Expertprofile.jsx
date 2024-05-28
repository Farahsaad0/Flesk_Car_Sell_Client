import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/Expertprofile.css";
import axios from "../../api/axios";
import { Row } from "reactstrap";
import Loader from "../loader/Loader";
import CarItem from "./CarItem";

// Fonction pour récupérer le nombre de jobs acceptés par un expert donné
// const getJobsCountByExpert = async (expertId) => {
//   try {
//     const response = await axios.get(`/nbExpertisme/${expertId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching jobs count by expert:', error);
//     return null;
//   }
// };

function ExpertProfile() {
  const location = useLocation();
  const expert = location.state.expert;
  const [jobsCountByExpert, setJobsCountByExpert] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component load
  }, []);

  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const count = await getJobsCountByExpert(expert._id);
  //         console.log(count)
  //         console.log(count)
  //         console.log(count)
  //         console.log(count)
  //         console.log(count)
  //         setJobsCountByExpert(count);
  //       } catch (error) {
  //         console.error('Error fetching jobs count by expert:', error);
  //       }
  //     }

  //     fetchData();
  //   }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`/getCarAdByUserId/${expert._id}`);
        console.log(response.data);
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };
    window.scrollTo(0, 0); // Scroll to the top of the page on component load

    fetchCars();
  }, []);

  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        const response = await axios.get(`/nbExpertisme/${expert._id}`);
        setJobsCountByExpert(response.data.jobCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobCount();
  }, [expert]);

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container bootstrap snippets bootdey">
        <div className="row">
          <div className="profile-nav col-md-3">
            <div className="panel">
              <div className="user-heading round">
                <a href="#">
                  <img
                    src={`http://localhost:8000/images/${expert.photo}`}
                    alt=""
                  />
                </a>
                <h1>
                  <b>{`${expert.Nom} ${expert.Prenom}`}</b>
                </h1>
                <p>{expert.Email}</p>
              </div>
            </div>
          </div>

          <div className="panel col">
            <div className="bio-graph-heading" style={{ color: "#1b2651" }}>
              <b>
                "Passionné par l'automobile depuis toujours, je suis là pour
                vous offrir une expertise personnalisée et vous guider vers le
                véhicule parfaitement adapté à vos besoins et à votre style de
                vie. Faites de chaque achat une expérience unique et sans
                souci."{" "}
              </b>
            </div>
            <div className="panel-body bio-graph-info">
              <h1>Informations</h1>
              <div className="row">
                <div className="bio-row">
                  <p>
                    <span>Nom </span>: {expert.Nom}
                  </p>
                </div>
                <div className="bio-row">
                  <p>
                    <span>Prénom </span>: {expert.Prenom}
                  </p>
                </div>

                <div className="bio-row">
                  <p>
                    <span>Adresse</span>: {expert.Adresse}
                  </p>
                </div>

                <div className="bio-row">
                  <p>
                    <span>Email </span>: {expert.Email}
                  </p>
                </div>
                <div className="bio-row">
                  <p>
                    <span>Téléphone </span>: {expert.Numéro}
                  </p>
                </div>
                <div className="bio-row">
                  <p>
                    <span>Spécialité </span>: {expert.ExpertId.spécialité}
                  </p>
                </div>
                <div className="bio-row">
                  <p>
                    <span>Expérience </span>: {expert.ExpertId.experience}
                  </p>
                </div>
                <div className="bio-row">
                  <p>
                    <span>Prix </span>: {expert.ExpertId.prix}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="panel">
              <div className="panel-body">
                <div className="bio-chart">
                  <div
                    style={{
                      display: "inline",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <canvas width="100" height="100px"></canvas>
                    <input
                      className="knob"
                      data-width="100"
                      data-height="100"
                      data-displayprevious="true"
                      data-thickness=".2"
                      data-fgcolor="#e06b7d"
                      data-bgcolor="#e8e8e8"
                      style={{
                        width: "54px",
                        height: "33px",
                        position: "absolute",
                        verticalAlign: "middle",
                        marginTop: "33px",
                        marginLeft: "-77px",
                        border: "0px",
                        fontWeight: "bold",
                        fontStyle: "normal",
                        fontVariant: "normal",
                        fontStretch: "normal",
                        fontSize: "20px",
                        lineHeight: "normal",
                        fontFamily: "Arial",
                        textAlign: "center",
                        color: "rgb(224, 107, 125)",
                        padding: "0px",
                        WebkitAppearance: "none",
                        background: "none",
                      }}
                    />
                  </div>
                </div>
                <div className="bio-desk">
                  <h4 className="red">Nombre de jobs acceptés</h4>
                  <p>
                    {jobsCountByExpert ? jobsCountByExpert : "Chargement..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Row className="car-list">
          {loading ? (
            <Loader />
          ) : (
            cars.map((car) => <CarItem key={car._id} car={car} />)
          )}
        </Row>
      </div>
    </>
  );
}

export default ExpertProfile;
