import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import ExpertCard from "./Expertcard";

const ExpertsPage = () => {
  const [experts, setExperts] = useState(null); // Initialisez experts à null

  useEffect(() => {
    // Fetch experts data from your API
    const fetchExperts = async () => {
      try {
        const response = await axios.get("/experts");
        setExperts(response.data.approvedExperts); // Set the experts data directly
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

//   const toggle = () => setModal(!modal);

  const hireExpert = async (expertId) => {
    // Implement hiring logic here
    console.log("Hiring expert with ID:", expertId);
  };

  return (
    <div className="container">
      <h1 className="my-4">Experts</h1>
      <div className="row">
        {experts &&
          Object.keys(experts).map((expertId) => (
            <ExpertCard
              key={expertId}
              expert={experts[expertId]}
            />
          ))}
      </div>
    </div>
  );
};

export default ExpertsPage;
