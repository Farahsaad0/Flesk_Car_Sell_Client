import React, { useState, useEffect } from "react";
import axios from "axios";
import CarItem from "./CarItem";
import "../../styles/car-item.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8000/carAds");
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
    <div className="car-list">
      {loading ? (
        <div>Loading...</div>
      ) : (
        cars.map((car) => (
          <CarItem key={car._id} car={car} />
        ))
      )}
    </div>
  );
};

export default CarList;
