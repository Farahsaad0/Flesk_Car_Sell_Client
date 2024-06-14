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
  Input,
  Label,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ExpertsDemande = () => {
  const [expertJobs, setExpertJobs] = useState([]);
  const [clientJobs, setClientJobs] = useState([]);
  const [clientJobsPageNumber, setClientJobsPageNumber] = useState(0); // Numéro de la page actuelle
  const [clientJobsTotalPages, setClientJobsTotalPages] = useState(0);
  const [clientJobsPerPage, setClientJobsPerPage] = useState(5);
  const [clientJobsSortBy, setClientJobsSortBy] = useState("submitDate");
  const [clientJobsSortOrder, setClientJobsSortOrder] = useState(-1);
  const [expertJobsPageNumber, setExpertJobsPageNumber] = useState(0); // Numéro de la page actuelle
  const [expertJobsTotalPages, setExpertJobsTotalPages] = useState(0);
  const [expertJobsPerPage, setExpertJobsPerPage] = useState(5);
  const [expertJobsSortBy, setExpertJobsSortBy] = useState("submitDate");
  const [expertJobsSortOrder, setExpertJobsSortOrder] = useState(-1);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth._id;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchJobsAsClient(userId);
  }, [
    clientJobsPageNumber,
    clientJobsSortOrder,
    clientJobsPerPage,
    clientJobsPageNumber,
  ]);

  useEffect(() => {
    fetchJobsAsExpert(userId);
  }, [
    expertJobsPageNumber,
    expertJobsSortOrder,
    expertJobsPerPage,
    expertJobsPageNumber,
  ]);

  // useEffect(() => {
  //   fetchJobsAsExpert(userId);
  // }, [pageNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJobsAsExpert = async (userId) => {
    try {
      const response = await axiosPrivate.get(`/jobs/expert/${userId}`, {
        params: {
          page: expertJobsPageNumber + 1,
          limit: expertJobsPerPage,
          sortBy: expertJobsSortBy,
          sortOrder: expertJobsSortOrder,
        },
      });
      setExpertJobs(response?.data?.data);
      setExpertJobsTotalPages(response?.data?.totalPages); // Définir le nombre total de pages
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des demandes d'expertise en attente :",
        error
      );
    }
  };
  const fetchJobsAsClient = async (userId) => {
    try {
      const response = await axiosPrivate.get(`/jobs/client/${userId}`, {
        params: {
          page: clientJobsPageNumber + 1,
          limit: clientJobsPerPage,
          sortBy: clientJobsSortBy,
          sortOrder: clientJobsSortOrder,
        },
      });
      setClientJobs(response?.data?.data);
      setClientJobsTotalPages(response?.data?.totalPages); // Définir le nombre total de pages
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des demandes d'expertise en attente :",
        error
      );
    }
  };

  const handleClientJobsPageClick = ({ selected }) => {
    setClientJobsPageNumber(selected);
  };
  const handleExpertJobsPageClick = ({ selected }) => {
    setExpertJobsPageNumber(selected);
  };

  const acceptDemande = async (jobId) => {
    try {
      await axiosPrivate.put(`/jobs/accept/${jobId}`);
      fetchJobsAsExpert(userId);
      fetchJobsAsClient(userId);
    } catch (error) {
      console.error("Erreur lors de l'approbation de l'expert :", error);
    }
  };

  const rejeterDemande = async (jobId) => {
    try {
      await axiosPrivate.put(`/jobs/reject/${jobId}`);
      fetchJobsAsExpert(userId);
      fetchJobsAsClient(userId);
    } catch (error) {
      console.error("Erreur lors du rejet de l'expert :", error);
    }
  };
  const cancelDemande = async (jobId) => {
    try {
      await axiosPrivate.put(`/jobs/cancel/${jobId}`);
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

  const handleClientPerPageChange = (e) => {
    setClientJobsPerPage(parseInt(e.target.value)); // Parse the selected value to an integer
    setClientJobsPageNumber(0); // Reset page number when changing the number of users per page
  };

  const handleExpertPerPageChange = (e) => {
    setExpertJobsPerPage(parseInt(e.target.value)); // Parse the selected value to an integer
    setExpertJobsPageNumber(0); // Reset page number when changing the number of users per page
  };

  const handleClientJobsSortChange = (e) => {
    const value = e.target.value;
    if (value === "croissant") {
      setClientJobsSortOrder(1);
    } else {
      setClientJobsSortOrder(-1);
    }
  };

  const handleExpertJobsSortChange = (e) => {
    const value = e.target.value;
    if (value === "croissant") {
      setExpertJobsSortOrder(1);
    } else {
      setExpertJobsSortOrder(-1);
    }
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
              {" "}
              <Row className="row-cols-lg-auto  d-flex justify-content-between align-items-center mb-3">
                <Col className=" d-flex align-items-center  gap-2">
                  <Col>
                    {/* <div className=" d-flex align-items-center gap-3 mb-5"> */}
                    <Label for="priceOrder">
                      <i className="ri-sort-asc"></i> Trier par
                    </Label>
                  </Col>
                  <Col>
                    <Input
                      type="select"
                      id="priceOrder"
                      onChange={handleClientJobsSortChange}
                      style={{ width: "fit-content" }}
                    >
                      <option value="décroissant">les plus récent</option>
                      <option value="croissant">les plus ancien</option>
                    </Input>
                  </Col>
                </Col>

                <Col className=" d-flex align-items-center gap-1">
                  <Col>
                    <Input
                      type="select"
                      id="perPageSelect"
                      value={clientJobsPerPage}
                      onChange={handleClientPerPageChange}
                      style={{ width: "fit-content" }}
                    >
                      <option value={5}> 5 </option>
                      <option value={10}> 10 </option>
                      <option value={30}> 30 </option>
                      <option value={50}> 50 </option>
                    </Input>
                  </Col>
                  <Col>
                    <Label for="perPageSelect">par page</Label>
                  </Col>
                </Col>
              </Row>
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
                    pageCount={clientJobsTotalPages}
                    onPageChange={handleClientJobsPageClick}
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
                <Row className="row-cols-lg-auto  d-flex justify-content-between align-items-center mb-3">
                  <Col className=" d-flex align-items-center  gap-2">
                    <Col>
                      {/* <div className=" d-flex align-items-center gap-3 mb-5"> */}
                      <Label for="priceOrder">
                        <i className="ri-sort-asc"></i> Trier par
                      </Label>
                    </Col>
                    <Col>
                      <Input
                        type="select"
                        id="priceOrder"
                        onChange={handleExpertJobsSortChange}
                        style={{ width: "fit-content" }}
                      >
                        <option value="décroissant">les plus récent</option>
                        <option value="croissant">les plus ancien</option>
                      </Input>
                    </Col>
                  </Col>

                  <Col className=" d-flex align-items-center gap-1">
                    <Col>
                      <Input
                        type="select"
                        id="perPageSelect"
                        value={expertJobsPerPage}
                        onChange={handleExpertPerPageChange}
                        style={{ width: "fit-content" }}
                      >
                        <option value={5}> 5 </option>
                        <option value={10}> 10 </option>
                        <option value={30}> 30 </option>
                        <option value={50}> 50 </option>
                      </Input>
                    </Col>
                    <Col>
                      <Label for="perPageSelect">par page</Label>
                    </Col>
                  </Col>
                </Row>
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
                            {job?.paymentStatus !== "completed" ? (
                              job.accepted === "pending" ? (
                                <div className="d-flex w-100 gap-2 space-between">
                                  <Button
                                    className="btn  flex-fill"
                                    color="success"
                                    size="sm"
                                    onClick={() => acceptDemande(job?._id)}
                                    disabled={job.accepted === "accepted"}
                                  >
                                    Accepter
                                  </Button>
                                  <Button
                                    className="btn  flex-fill"
                                    color="warning"
                                    size="sm"
                                    onClick={() => rejeterDemande(job?._id)}
                                    disabled={job.accepted === "accepted"}
                                  >
                                    Rejeter
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  className="btn w-100 btn-info"
                                  // color="warning"
                                  size="sm"
                                >
                                  En attente de paiement
                                </Button>
                              )
                            ) : (
                              <Button
                                className="btn  w-100 btn-success"
                                // color="warning"
                                size="sm"
                                onClick={() => goToChat(job._id)}
                              >
                                Discuter
                              </Button>
                            )}
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
                      pageCount={expertJobsTotalPages}
                      onPageChange={handleExpertJobsPageClick}
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
