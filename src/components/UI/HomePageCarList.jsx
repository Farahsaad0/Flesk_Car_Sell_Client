import React, { useState, useEffect } from "react";
import CarItem from "./CarItem";
import "../../styles/car-item.css";
import { Row } from "reactstrap";
import axios from "../../api/axios";
import Loader from "../loader/Loader";

const HomepageCarList = () => {
  const [sponsoredCars, setSponsoredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const feature = "Mis en avant sur la page d'accueil"

  useEffect(() => {
    const fetchSponsoredCars = async () => {
      try {
        const response = await axios.get(`/carAds/sponsored?feature=${encodeURIComponent(feature)}`);
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

  return (
    <Row className="car-list">
      {loading ? (
        <Loader/>
      ) : (
        sponsoredCars.map((car) => <CarItem key={car._id} car={car} />)
      )}
    </Row>
  );
};

export default HomepageCarList;
