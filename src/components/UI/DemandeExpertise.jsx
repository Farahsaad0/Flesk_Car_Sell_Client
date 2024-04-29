import React, { useState, useEffect } from "react";
import { Button, Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const ExpertsDemande = () => {
  const [jobs, setJobs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0); // Numéro de la page actuelle
  const [totalPages, setTotalPages] = useState(0);
  const { auth } = useAuth();

  const expertId = auth._id;

  useEffect(() => {
    // Récupérer les données des demandes d'expertise depuis le serveur lorsque le composant est monté
    console.log(expertId + " <<<<<<<<<<< expert id")
    fetchJobs(expertId);
  }, [pageNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJobs = async (expertId) => {
    try {
      const response = await axios.get(`/jobs/${expertId}`);
      setJobs(response?.data?.data);
      setTotalPages(response?.data?.totalPages); // Définir le nombre total de pages
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes d'expertise en attente :", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const acceptDemande = async (jobId) => {
    try {
      await axios.put(`/jobs/accept/${jobId}`);
      fetchJobs(expertId);
    } catch (error) {
      console.error("Erreur lors de l'approbation de l'expert :", error);
    }
  };

  const rejeterDemande = async (jobId) => {
    try {
      await axios.put(`/jobs/reject/${jobId}`);
      fetchJobs(expertId);
    } catch (error) {
      console.error("Erreur lors du rejet de l'expert :", error);
    }
  };

  return (
    <Row>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Demandes d'expertise
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
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <tr key={index}>
                      <td>
                        {job.client.Nom} {job.client.Prenom}
                      </td>
                      <td>{job.client.Email}</td>
                      <td>{job.jobDescription}</td>
                      <td className="button-group">
                        <Button
                          className="btn"
                          color="success"
                          size="sm"
                          onClick={() => acceptDemande(job._id)}
                        >
                          Accepter
                        </Button>
                        <Button
                          className="btn"
                          color="warning"
                          size="sm"
                          onClick={() => rejeterDemande(job._id)}
                        >
                          Rejeter
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="table-active">
                      <center>
                        Aucune demande en attente !
                      </center>
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
  );
};

export default ExpertsDemande;
