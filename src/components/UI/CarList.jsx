import React, { useState, useEffect } from "react";
import CarItem from "./CarItem";
import "../../styles/car-item.css";
import { Col, Input, Label, Row } from "reactstrap";
import axios from "../../api/axios";
import Loader from "../loader/Loader";
import ReactPaginate from "react-paginate";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [adsPerPage, setAdsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState(-1);
  const [filter, setFilter] = useState("all");

  const [sponsoredCars, setSponsoredCars] = useState([]);
  // const [loading, setLoading] = useState(true);

  const feature = "Mis en avant dans les résultats de recherche";

  useEffect(() => {
    const fetchSponsoredCars = async () => {
      try {
        const response = await axios.get(
          `/carAds/sponsored?feature=${encodeURIComponent(feature)}`
        );
        console.log(response.data);
        setSponsoredCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    fetchSponsoredCars();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/carAds", {
          params: {
            page: pageNumber + 1,
            limit: adsPerPage,
            sortField,
            sortOrder,
          },
        });
        setCars(response?.data?.sortedAds);
        setTotalPages(response?.data?.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    fetchCars();
  }, [pageNumber, adsPerPage, sortField, sortOrder]);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const handlePerPageChange = (e) => {
    setAdsPerPage(parseInt(e.target.value)); // Parse the selected value to an integer
    setPageNumber(0); // Reset page number when changing the number of users per page
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "croissant") {
      setSortField("prix");
      setSortOrder(1);
    } else if (value === "décroissant") {
      setSortField("prix");
      setSortOrder(-1);
    } else if (value === "defaut") {
      setSortField("date");
      setSortOrder(-1);
    }
  };

  return (
    <>
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
              onChange={handleSortChange}
              style={{ width: "fit-content" }}
            >
              <option value="defaut">défaut (Les plus récents)</option>
              <option value="croissant">Prix croissant</option>
              <option value="décroissant">Prix décroissant</option>
            </Input>
          </Col>
        </Col>

        <Col className=" d-flex align-items-center gap-1">
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
      <Row className="car-list">
        {loading ? (
          <Loader />
        ) : cars.length > 0 ? (
          cars.map((car) => <CarItem key={car._id} car={car} />)
        ) : (
          <div>
            <center className="fs-1 fw-light">
              Pas d'annonces de voitures disponibles pour le moment. Revenez
              plus tard !{" "}
            </center>
          </div>
        )}
      </Row>
      <Row>
        <nav aria-label="Page navigation ">
          <ul className="pagination justify-content-center">
            <ReactPaginate
              breakLabel="..."
              previousLabel={
                <div className="page-link fst-normal">Previous</div>
              }
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

export default CarList;
