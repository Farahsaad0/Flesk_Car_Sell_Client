import React, { useEffect, useState } from "react";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "../styles/product-image-slider.scss";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "../components/loader/Loader";
import useAuth from "../hooks/useAuth";

const CarDetails = () => {
  const { id } = useParams();
  const [singleCarItem, setSingleCarItem] = useState({});
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expertsLoading, setExpertsLoading] = useState(true);
  const [open, setOpen] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [hiredExpertsForCar, setHiredExpertsForCar] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      fetchHiredExpertsForCar();
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

  const fetchHiredExpertsForCar = async () => {
    try {
      // Fetch the list of hired experts for the current car
      const response = await axiosPrivate.get(
        `/jobs/car/${id}/assigned-experts`
      );
      setHiredExpertsForCar(response.data);
    } catch (error) {
      console.error("Error fetching hired experts for car: ", error);
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`/carAds/details/${id}`);
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

  const profileImageUrl = singleCarItem?.utilisateur?.photo
    ? `http://localhost:8000/images/${singleCarItem.utilisateur.photo}`
    : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);

  return (
    <Helmet title={singleCarItem.carName}>
      {loading ? (
        <Loader />
      ) : (
        <section>
          <Container>
            <Row>
              <Col lg="6">
                <Swiper
                  loop={true}
                  spaceBetween={10}
                  navigation={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  grabCursor={true}
                  thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                  className="product-images-slider"
                >
                  {singleCarItem.photos.map((item, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`http://localhost:8000/images/${item}`}
                        alt="product images"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={"10rem"}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="product-images-slider-thumbs"
                >
                  {singleCarItem.photos.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className="product-images-slider-thumbs-wrapper">
                        <img
                          src={`http://localhost:8000/images/${item}`}
                          alt="product images"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Col>

              <Col lg="6">
                <div className="car__info">
                  <h2 className="section__title">
                    {singleCarItem.titre}{" "}
                    {singleCarItem.sponsorship && (
                      <i
                        style={{ color: "#f9a826" }}
                        className="ri-star-s-fill"
                      ></i>
                    )}{" "}
                  </h2>

                  <div className=" d-flex align-items-center gap-5 mb-4 mt-3">
                    <h6 className="rent__price fw-bold fs-4">
                      {singleCarItem.prix || <small>aucune prix donnee</small>}
                      TND
                    </h6>
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
                      {singleCarItem.modele || (
                        <small>aucune modele donnee</small>
                      )}
                    </span>
                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-settings-2-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.annee || (
                        <small>aucune annee donnee</small>
                      )}
                    </span>
                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-timer-flash-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.vitesse || (
                        <small>aucune vitesse donnee</small>
                      )}
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
                      {singleCarItem.location || (
                        <small>aucune location donnee</small>
                      )}
                    </span>
                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-wheelchair-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.kilometrage || (
                        <small>aucune kilometrage donnee</small>
                      )}
                    </span>
                    <span className=" d-flex align-items-center gap-1 section__description">
                      <i
                        className="ri-building-2-line"
                        style={{ color: "#f9a826" }}
                      ></i>
                      {singleCarItem.marque || (
                        <small>aucune marque donnee</small>
                      )}
                    </span>
                  </div>

                  <p className="section__description"  style={{ whiteSpace:"pre"}}>
                    {singleCarItem.description || (
                      <small>aucune description donnee</small>
                    )}
                  </p>
                </div>
                <div
                  style={{ position: "absolute", bottom: "0", display: "flex" }}
                >
                  <img
                    style={{ width: "3rem", height: "3rem" }}
                    className="img-radius"
                    src={profileImageUrl}
                    alt=""
                  />
                  <div className="ms-2">
                    <div className="h7">
                      {singleCarItem?.utilisateur?.Prenom}{" "}
                      {singleCarItem?.utilisateur?.Nom}
                    </div>
                    <p>{singleCarItem?.utilisateur?.Numéro}</p>
                  </div>
                </div>
              </Col>
            </Row>

            <Accordion open={open} toggle={toggle} className="mt-5">
              <AccordionItem>
                <AccordionHeader targetId="1">
                  Consulter des Expert
                </AccordionHeader>
                <AccordionBody accordionId="1">
                  <Row>
                    {expertsLoading ? (
                      <div>Loading...</div>
                    ) : (
                      experts
                        .filter((expert) => expert._id !== auth._id)
                        .map((expert) => (
                          <ExpertItem
                            key={expert._id}
                            expert={expert}
                            carAdId={id}
                            hiredExpertsForCar={hiredExpertsForCar}
                          />
                        ))
                    )}
                  </Row>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </Container>
        </section>
      )}
    </Helmet>
  );
};

export default CarDetails;
