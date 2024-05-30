import React from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import CarList from "../components/UI/CarList";
// import carData from "../assets/data/carData";

const CarListing = () => {
  return (
    <Helmet title="Cars">
      <CommonSection title="Car Listing" />

      <section>
        <Container>
          <Row>
            <CarList />
            {/* {carData.map((item) => (
              <CarItem item={item} key={item.id} />
            ))} */}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarListing;
