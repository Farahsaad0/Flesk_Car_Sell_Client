import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import "../../styles/testimonial.css";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
const Testimonial = () => {
  const [experts, setExperts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get("/experts");
        setExperts(response.data.approvedExperts);
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleClick = (expert) => {
    if (expert) {
      // Navigation vers la page du profil de l'expert avec les données de l'expert passées
      navigate("/expertprofile", { state: { expert } });
    }
  };

  return (
    <Slider {...settings}>
      {experts.map((expert, index) => (
        <div key={expert._id} className="testimonial py-4 px-3">
          <div key={index} className="mt-3 d-flex align-items-center  round gap-4">
            <img
              src={`http://localhost:8000/images/${expert.photo}`}
              // className="w-25 h-25 rounded-2"
              style={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
              alt=""
              onClick={() => handleClick(expert)}
            />

            <div>
              <h6 className="mb-0 mt-3" onClick={() => handleClick(expert)}>
                {expert.Nom} {expert.Prenom}
              </h6>
              <p className="section__description">
                {expert.ExpertId.spécialité}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Testimonial;
