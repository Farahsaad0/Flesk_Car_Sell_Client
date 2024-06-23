import React, { useState, useEffect } from "react";
import { Row, Button, Container } from "reactstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CarItem from "./CarItem";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../loader/Loader";
import { toast } from "sonner";

const UserCarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const fetchUserCars = async () => {
    const userId = auth._id;
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(`/getCarAdByUserId/${userId}`);

      console.log(response.data);
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user cars:", error);
      setLoading(false);
      toast.error(
        "Un erreur s'est produite lors de la récupération de vos annonces"
      );
    }
  };

  useEffect(() => {
    fetchUserCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/carAds/${id}`);
      console.log(response.data);
      toast.success("Votre annonce a été supprimée avec succès");
      fetchUserCars();
    } catch (error) {
      toast.error(
        "Un erreur s'est produite lors de la suppression de votre annonce"
      );
      console.error("Error deleting car ad:", error);
    }
  };

  const handleEdit = (id) => {
    // Rediriger l'utilisateur vers la page de modification de l'annonce avec l'ID spécifié
    navigate(`/edit-car/${id}`);
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Mes annonces</h1>
      <Row>
        {loading ? (
          <Loader />
        ) : cars.length === 0 ? (
          <div>
            <center className="fs-1 fw-light">
              Vous avez acun annonces de voitures pour le moment!
            </center>
          </div>
        ) : (
          cars.map((car) => (
            <CarItem
              key={car._id}
              car={car}
              onEdit={() => handleEdit(car._id)}
              onDelete={() => handleDelete(car._id)}
            />
          ))
        )}
      </Row>
    </Container>
  );
};

export default UserCarList;
