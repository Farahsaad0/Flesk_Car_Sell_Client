import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Card,
  CardTitle,
  CardBody,
  Container,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const ExpertsDemande = () => {
  const [expertJobs, setExpertJobs] = useState([]);
  const [clientJobs, setClientJobs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0); // Numéro de la page actuelle
  const [totalPages, setTotalPages] = useState(0);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth._id;

  useEffect(() => {
    // Récupérer les données des demandes d'expertise depuis le serveur lorsque le composant est monté
    console.log(userId + " <<<<<<<<<<< expert id");
    fetchJobsAsExpert(userId);
    fetchJobsAsClient(userId);
  }, [pageNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJobsAsExpert = async (userId) => {
    try {
      const response = await axios.get(`/jobs/expert/${userId}`);
      setExpertJobs(response?.data?.data);
      setTotalPages(response?.data?.totalPages); // Définir le nombre total de pages
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des demandes d'expertise en attente :",
        error
      );
    }
  };
  const fetchJobsAsClient = async (userId) => {
    try {
      const response = await axios.get(`/jobs/client/${userId}`);
      setClientJobs(response?.data?.data);
      setTotalPages(response?.data?.totalPages); // Définir le nombre total de pages
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des demandes d'expertise en attente :",
        error
      );
    }
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const acceptDemande = async (jobId) => {
    try {
      await axios.put(`/jobs/accept/${jobId}`);
      fetchJobsAsExpert(userId);
      fetchJobsAsClient(userId);
    } catch (error) {
      console.error("Erreur lors de l'approbation de l'expert :", error);
    }
  };

  const rejeterDemande = async (jobId) => {
    try {
      await axios.put(`/jobs/reject/${jobId}`);
      fetchJobsAsExpert(userId);
      fetchJobsAsClient(userId);
    } catch (error) {
      console.error("Erreur lors du rejet de l'expert :", error);
    }
  };
  const cancelDemande = async (jobId) => {
    try {
      await axios.put(`/jobs/cancel/${jobId}`);
      fetchJobsAsExpert(userId);
      fetchJobsAsClient(userId);
    } catch (error) {
      console.error("Erreur lors du rejet de l'expert :", error);
    }
  };

  const goToChat = async (jobId) => {
    navigate(`/consultation/${jobId}`);
  };

  const redirectToPaymentPage = async (link) => {
    window.location.href = link;
  };

  const renderButton = (job) => {
    let buttonText = "";
    let buttonOnClick = () => {};
    let buttonClass = "btn ms-2 w-75";
    let buttonDisabled = false;

    if (job.accepted === "cancelled") {
      buttonText = "Annulé";
      buttonOnClick = () => goToChat(job._id);
      buttonClass += " btn-danger";
      buttonDisabled = true;
    } else if (job.accepted === "accepted" && job.paymentStatus === "pending") {
      buttonText = "Payer";
      buttonOnClick = () => redirectToPaymentPage(job.paymentLink);
      buttonClass += " btn-warning";
    } else if (job.paymentStatus === "completed") {
      buttonText = "Discuter";
      buttonOnClick = () => goToChat(job._id);
      buttonClass += " btn-success";
    } else {
      buttonText = "Annuler";
      buttonOnClick = () => cancelDemande(job._id);
      buttonClass += " btn-danger";
    }

    return (
      <Button
        className={buttonClass}
        // color="warning"
        size="sm"
        onClick={buttonOnClick}
        disabled={buttonDisabled}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <Container className={"my-4"}>
      <Row className={"mb-4"}>
        <Col lg="12">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-card-text me-2"> </i>
              Les demandes d'expertise que vous avez initiées:
            </CardTitle>
            <CardBody className="">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clientJobs?.length > 0 ? (
                    clientJobs?.map((job, index) => (
                      <tr key={index}>
                        {/* <Link
                          to={`/consultation/${job._id}`}
                          style={{ width: "100%", height: "100%" }}
                        > */}
                        <td
                          onClick={() => goToChat(job._id)}
                          style={{ cursor: "pointer" }}
                        >
                          {job?.expert?.Nom} {job?.expert?.Prenom}
                        </td>
                        {/* </Link> */}
                        <td
                          onClick={() => goToChat(job._id)}
                          style={{ cursor: "pointer" }}
                        >
                          {job?.expert?.Email}
                        </td>
                        <td
                          onClick={() => goToChat(job._id)}
                          style={{ cursor: "pointer" }}
                        >
                          {job?.jobDescription}
                        </td>
                        <td className="button-group">{renderButton(job)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="table-active">
                        <center>Aucune demande en attente !</center>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <nav aria-label="Navigation par page">
                <ul className="pagination justify-content-center">
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel={<div className="page-link">Précédent</div>}
                    nextLabel={<div className="page-link">Suivant</div>}
                    pageRangeDisplayed={4}
                    containerClassName={"pagination "}
                    activeClassName={" active"}
                    pageCount={totalPages}
                    onPageChange={handlePageClick}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    renderOnZeroPageCount={null}
                  />
                </ul>
              </nav>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {auth.Role !== "Utilisateur" && (
        <Row>
          <Col lg="12">
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i className="bi bi-card-text me-2"> </i>
                Demandes d'expertise reçu:
              </CardTitle>
              <CardBody className="">
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expertJobs?.length > 0 ? (
                      expertJobs?.map((job, index) => (
                        <tr key={index}>
                          <td
                            onClick={() => goToChat(job._id)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* <Link to={`/consultation/${job._id}`}> */}
                            {job?.client?.Nom} {job?.client?.Prenom}
                            {/* </Link> */}
                          </td>
                          <td
                            onClick={() => goToChat(job._id)}
                            style={{ cursor: "pointer" }}
                          >
                            {job?.client?.Email}
                          </td>
                          <td
                            onClick={() => goToChat(job._id)}
                            style={{ cursor: "pointer" }}
                          >
                            {job?.jobDescription}
                          </td>
                          <td className="button-group">
                            <Button
                              className="btn ms-3 w-auto "
                              color="success"
                              size="sm"
                              onClick={() => acceptDemande(job?._id)}
                              disabled={job.accepted === "accepted"}
                            >
                              Accepter
                            </Button>
                            <Button
                              className="btn ms-3 w-auto "
                              color="warning"
                              size="sm"
                              onClick={() => rejeterDemande(job?._id)}
                              disabled={job.accepted === "accepted"}
                            >
                              Rejeter
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="table-active">
                          <center>Aucune demande en attente !</center>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <nav aria-label="Navigation par page">
                  <ul className="pagination justify-content-center">
                    <ReactPaginate
                      breakLabel="..."
                      previousLabel={<div className="page-link">Précédent</div>}
                      nextLabel={<div className="page-link">Suivant</div>}
                      pageRangeDisplayed={4}
                      containerClassName={"pagination "}
                      activeClassName={" active"}
                      pageCount={totalPages}
                      onPageChange={handlePageClick}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      renderOnZeroPageCount={null}
                    />
                  </ul>
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ExpertsDemande;
