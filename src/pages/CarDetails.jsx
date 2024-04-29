import React, { useEffect, useState } from "react";

import carData from "../assets/data/carData";
import {
  Container,
  Row,
  Col,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { useParams } from "react-router-dom";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import axios from "../api/axios";
import ExpertItem from "../components/UI/ExpertItem";

const CarDetails = () => {
  const { id } = useParams();
  const [singleCarItem, setSingleCarItem] = useState({});
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expertsLoading, setExpertsLoading] = useState(true);
  const [open, setOpen] = useState(1);

  // const toggle = () => {
  //   if (experts.length === 0) {
  //     fetchExperts();
  //   }
  //   setOpen(!open);
  // };
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
      fetchExperts();
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axios.get("/experts");
      setExperts(response.data.approvedExperts);
      setExpertsLoading(false);
    } catch (error) {
      console.error("Error fetching experts: ", error);
      setExpertsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`/carAds/${id}`);
        console.log(response.data);
        setSingleCarItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    fetchCar();
  }, []);

  const imageUrl = singleCarItem
    ? `http://localhost:8000/images/${singleCarItem.photo}`
    : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);

  return (
    <Helmet title={singleCarItem.carName}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <section>
          <Container>
            <Row>
              <Col lg="6">
                <img src={imageUrl} alt="" className="w-100" />
              </Col>

              <Col lg="6">
                <div className="car__info">
                  <h2 className="section__title">{singleCarItem.titre}</h2>

                  <div className=" d-flex align-items-center gap-5 mb-4 mt-3">
                    <h6 className="rent__price fw-bold fs-4">
                      {singleCarItem.prix} TND
                    </h6>

                    {/* <span className=" d-flex align-items-center gap-2">
                      <span style={{ color: "#f9a826" }}>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                      </span>
                      ({singleCarItem.rating} ratings)
                    </span> */}
                  </div>

                  <div
                    className=" d-flex align-items-center mt-3"
                    style={{ columnGap: "4rem" }}
                  >
                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-roadster-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.modele}
                    </span>

                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-settings-2-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.automatic}
                    </span>

                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-timer-flash-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.speed}
                    </span>
                  </div>

                  <div
                    className=" d-flex align-items-center mt-3"
                    style={{ columnGap: "2.8rem" }}
                  >
                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-map-pin-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.gps}
                    </span>

                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-wheelchair-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.seatType}
                    </span>

                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-building-2-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.marque}
                    </span>
                  </div>
                  <p className="section__description">
                    {singleCarItem.description}
                  </p>
                </div>
              </Col>

              {/* <Col lg="7" className="mt-5">
                <div className="booking-info mt-5">
                  <h5 className="mb-4 fw-bold ">Booking Information</h5>
                  <BookingForm />
                </div>
              </Col>

              <Col lg="5" className="mt-5">
                <div className="payment__info mt-5">
                  <h5 className="mb-4 fw-bold ">Payment Information</h5>
                  <PaymentMethod />
                </div>
              </Col> */}
            </Row>

            <Accordion flush  open={open} toggle={toggle} className="mt-5">
              <AccordionItem>
                <AccordionHeader targetId="1">
                  Consulter des Expert
                </AccordionHeader>
                <AccordionBody accordionId="1">
                  <Row>
                    {expertsLoading ? (
                      <div>Loading...</div>
                    ) : (
                      experts.map((expert) => (
                        <ExpertItem key={expert._id} expert={expert} carAdId={id} />
                      ))
                    )}
                  </Row>
                </AccordionBody>
              </AccordionItem>
            </Accordion>

            {/* </Col> */}
          </Container>
        </section>
      )}
    </Helmet>
  );
};

export default CarDetails;
