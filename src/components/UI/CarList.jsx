import React, { useState, useEffect } from "react";
import CarItem from "./CarItem";
import "../../styles/car-item.css";
import { Row } from "reactstrap";
import axios from "../../api/axios";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/carAds");
        console.log(response.data);
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <Row className="car-list">
      {loading ? (
        <div>Loading...</div>
      ) : (
        cars.map((car) => <CarItem key={car._id} car={car} />)
      )}
    </Row>
  );
};

export default CarList;
