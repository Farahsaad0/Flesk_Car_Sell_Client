import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import CarListing from "../pages/CarListing";
import CarDetails from "../pages/CarDetails";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import CreateAdForm from "../pages/CreateAd";
import Signup from "../Auth/Singup";
import Login from "../Auth/Login";
import ProfilePage from "../pages/Profilepage";
import UserCarList from "../components/UI/Myads";
import EditCarAd from "../components/UI/EditCar";
import ExpertsDemande from "../components/UI/DemandeExpertise";
import ExpertsPage from "../components/UI/Experts";
import Form from "../components/UI/DevenirExpert";
import ExpertProfile from "../components/UI/Expertprofile";
// import VerificationPage from "../Auth/Signup/verificationPage";
// import Main from "../Auth/Main";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cars" element={<CarListing />} />
      <Route path="/Experts" element={<ExpertsPage/>} />
      <Route path="/create-ad" element={<CreateAdForm />} />
      <Route path="/cars/:id" element={<CarDetails />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/myads" element={<UserCarList />} />
      <Route path="/edit-car/:id" element={<EditCarAd />} />
      <Route path="/demande" element={<ExpertsDemande />} />
       <Route path="/DevenirExpert" element={<Form/> } />
      {/* <Route path="/" exact element={<Main />} /> */}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/expertprofile" element={<ExpertProfile />} />
      {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
      {/* <Route path="/verification" component={<VerificationPage />} /> */}
    </Routes>
  );
};

export default Routers;
