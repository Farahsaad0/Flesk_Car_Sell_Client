import React, { useEffect, useState } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import CarItem from "./CarItem"; // Importer le composant CarItem
import "../../styles/find-car-form.css";
import axios from "../../api/axios";
import ReactPaginate from "react-paginate";

const FindCarForm = ({ cars }) => {
  // États de formulaire pour chaque critère de recherche
  const [adresse, setAdresse] = useState("");
  const [marque, setMarque] = useState("");
  const [date, setDate] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [anneeMin, setAnneeMin] = useState("");
  const [anneeMax, setAnneeMax] = useState("");
  const [modele, setModele] = useState("");
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [pageNumber, setPageNumber] = useState(0);
  const [adsPerPage, setAdsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Fonction de recherche des annonces de voiture
  const searchCars = async () => {
    try {
      const response = await axios.get("/carAds/search", {
        params: {
          page: pageNumber + 1,
          limit: adsPerPage,
          marque: marque || undefined,
          modele: modele || undefined,
          date: date || undefined,
          prixFrom: prixMin || undefined,
          prixTo: prixMax || undefined,
          anneeFrom: anneeMin || undefined,
          anneeTo: anneeMax || undefined,
          adresse: adresse || undefined,
        },
      });

      setTotalPages(response?.data?.page);
      setSearchResults(response?.data?.data); // Mettre à jour les résultats de la recherche
    } catch (error) {
      console.error(
        "Erreur lors de la recherche des annonces de voiture :",
        error
      );
      setSearchResults([]); // Réinitialiser les résultats de la recherche en cas d'erreur
    }
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const handlePerPageChange = (e) => {
    setAdsPerPage(parseInt(e.target.value)); // Parse the selected value to an integer
    setPageNumber(0); // Reset page number when changing the number of users per page
  };
  useEffect(() => {
    searchCars();
  }, [pageNumber, adsPerPage]);

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    searchCars(); // Appeler la fonction de recherche lors de la soumission du formulaire
  };

  // Rendu du formulaire de recherche
  return (
    <>
      <Row className="">
        <Col lg="4" md="4">
          <div className="find__cars-left">
            <h2>Trouvez votre voiture idéale ici</h2>
          </div>
        </Col>
        <Col lg="8" md="8" xl="8">
          <Form className="form" onSubmit={handleSubmit}>
            <div className=" d-flex align-items-center justify-content-between flex-wrap">
              <FormGroup className="form__group">
                <input
                  type="text"
                  placeholder="Adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  type="text"
                  placeholder="Marque"
                  value={marque}
                  onChange={(e) => setMarque(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  type="date"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  className="journey__time"
                  type="number"
                  placeholder="Prix min"
                  value={prixMin}
                  onChange={(e) => setPrixMin(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  className="journey__time"
                  type="number"
                  placeholder="Prix max"
                  value={prixMax}
                  onChange={(e) => setPrixMax(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  className="journey__time"
                  type="number"
                  placeholder="Année min"
                  value={anneeMin}
                  onChange={(e) => setAnneeMin(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  className="journey__time"
                  type="number"
                  placeholder="Année max"
                  value={anneeMax}
                  onChange={(e) => setAnneeMax(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <input
                  type="text"
                  placeholder="Modèle"
                  value={modele}
                  onChange={(e) => setModele(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="form__group">
                <button type="submit" className="btn find__car-btn">
                  Rechercher
                </button>
              </FormGroup>
            </div>

            {/* Afficher les résultats de la recherche */}
          </Form>
        </Col>
      </Row>
      {searchResults.length > 0 && (
        <Row className="row-cols-lg-auto  d-flex justify-content-between align-items-center my-3">
          <Col className=" d-flex ml-auto gap-1">
            <Col>
              <Input
                type="select"
                id="perPageSelect"
                value={adsPerPage}
                onChange={handlePerPageChange}
                style={{ width: "fit-content" }}
              >
                <option value={12}> 12 </option>
                <option value={20}> 20 </option>
                <option value={32}> 32 </option>
              </Input>
            </Col>
            <Col>
              <Label for="perPageSelect">par page</Label>
            </Col>
          </Col>
        </Row>
      )}
      <Row className=" w-100">
        {searchResults.map((car) => (
          <CarItem key={car._id} car={car} />
        ))}
      </Row>
      <Row>
        <nav aria-label="Page navigation ">
          <ul className="pagination justify-content-center">
            <ReactPaginate
              breakLabel="..."
              previousLabel={<div className="page-link">Previous</div>}
              nextLabel={<div className="page-link">Next</div>}
              pageCount={totalPages}
              onPageChange={handlePageClick}
              containerClassName={"pagination "}
              pageRangeDisplayed={2}
              activeClassName={" active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              renderOnZeroPageCount={null}
            />
          </ul>
        </nav>
      </Row>
    </>
  );
};

export default FindCarForm;
