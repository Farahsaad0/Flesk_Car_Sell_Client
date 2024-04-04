import React, { useState, useEffect } from "react";
import axios from "axios";
import CarItem from "./CarItem";
import { Row, Button } from "reactstrap";

const UserCarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("userData"))._id;
        if (!userId) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get(`http://localhost:8000/getCarAdByUserId/${userId}`);

        console.log(response.data);
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user cars:", error);
        setLoading(false);
      }
    };

    fetchUserCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/carAds/${id}`);
      console.log(response.data);
      setCars(cars.filter(car => car._id !== id));
    } catch (error) {
      console.error("Error deleting car ad:", error);
    }
  };

  const handleEdit = (id) => {
    // Rediriger l'utilisateur vers la page de modification de l'annonce avec l'ID spécifié
    // Vous pouvez utiliser React Router pour cela
  };

  return (
    <div className="container">
      <h1>Mes annonces</h1>
      <Row className="car-list">
        {loading ? (
          <div>Loading...</div>
        ) : cars.length === 0 ? (
          <div>No car ads found.</div>
        ) : (
          cars.map((car) => (
            <div key={car._id}>
              <CarItem car={car} />
              <Button onClick={() => handleEdit(car._id)}>Modifier</Button>
              <Button onClick={() => handleDelete(car._id)}>Supprimer</Button>
            </div>
          ))
        )}
      </Row>
    </div>
  );
};

export default UserCarList;
