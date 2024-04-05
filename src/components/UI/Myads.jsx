import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Button } from "reactstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import CarItem from "./CarItem";

const UserCarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Obtenez la fonction de navigation

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
    navigate(`/edit-car/${id}`); // Utilisez useNavigate pour la redirection
  };

  return (
    <div className="container">
      <h1>Mes annonces</h1>
      {loading ? (
        <div>Loading...</div>
      ) : cars.length === 0 ? (
        <div>No car ads found.</div>
      ) : (
        cars.map((car) => (
          <div key={car._id} className="mb-3 d-flex align-items-center justify-content-between">
            <CarItem car={car} />
            <div>
              <Button color="secondary" size="sm" className="me-2" onClick={() => handleEdit(car._id)}><BsPencilSquare /></Button>
              <Button color="danger" size="sm" onClick={() => handleDelete(car._id)}><BsTrash /></Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserCarList;
