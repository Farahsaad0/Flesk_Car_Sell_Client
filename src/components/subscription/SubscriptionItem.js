import { Col } from "reactstrap";
import "./style.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

const SubscriptionItem = ({ subscription, formData }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  // const [paymentData, setPaymentData] = useState({
  //   userId: auth._id,
  //   subscription: subscription._id,
  // });
  const redirectToKonnect = async () => {
    //* caches the form data to be ready for the user after completing the transaction
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axiosPrivate.post("/carAdCache", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Réponse du serveur:", response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
    }

    const paymentData = {
      userId: auth._id,
      subscription: subscription._id,
    };

      try {
        const response = await axiosPrivate.post("/init-payment", paymentData);
        window.location.href = response.data.payUrl; // Redirect to payment page
      } catch (error) {
        console.error("Error initializing payment:", error);
      }
  };

  return (
    <Col sm="6" md="4" lg="4" style={{ marginBlock: "1rem" }}>
      <div className="pricingTable">
        <div className="pricingTable-header">
          <i className="fa fa-adjust"></i>
          <div className="price-value">
            {new Intl.NumberFormat("en-TN", {
              style: "currency",
              currency: "TND",
            }).format(subscription.price)}
            <span className="month">
              {new Intl.NumberFormat("en-TN", {
                style: "currency",
                currency: "TND",
              }).format(subscription.price / subscription.duration)}{" "}
              par jour
            </span>
          </div>
        </div>
        <h3 className="heading">{subscription.type}</h3>
        <div className="pricing-content">
          <ul>
            {subscription.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="pricingTable-signup">
          <a onClick={redirectToKonnect}>acheter</a>
        </div>
      </div>
    </Col>
  );
};

export default SubscriptionItem;
