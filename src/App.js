import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import ApplyForAnExpertRoleForm from "./components/UI/DevenirExpert";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const CarListing = React.lazy(() => import("./pages/CarListing"));
const CreateAdForm = React.lazy(() => import("./pages/CreateAd"));
const CarDetails = React.lazy(() => import("./pages/CarDetails"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetails = React.lazy(() => import("./pages/BlogDetails"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const UserCarList = React.lazy(() => import("./components/UI/Myads"));
const EditCarAd = React.lazy(() => import("./components/UI/EditCar"));
const ExpertProfile = React.lazy(() => import("./components/UI/Expertprofile"));
const ExpertsPage = React.lazy(() => import("./components/UI/Experts"));
const ExpertsDemande = React.lazy(() =>
  import("./components/UI/DemandeExpertise")
);
const Signup = React.lazy(() => import("./Auth/Singup"));
const Login = React.lazy(() => import("./Auth/Login"));
const ProfilePage = React.lazy(() => import("./pages/Profilepage"));
const ResetPassword = React.lazy(() =>
  import("./Auth/ResetPassword/resetPasswordRequest")
);
const ChangePassword = React.lazy(() =>
  import("./Auth/ResetPassword/resetPassword")
);
const ExpertiseChat = React.lazy(() => import("./components/UI/ExpertiseChat"));

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cars" element={<CarListing />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/expertprofile" element={<ExpertProfile />} />
          <Route path="/Experts" element={<ExpertsPage />} />
          <Route path="/demandez_un_poste_d_expert" element={<ApplyForAnExpertRoleForm />} />
          {/*//* "Expert" and "Utilisateur" routes */}
          <Route
            element={
              <RequireAuth
                allowedRoles={["Utilisateur", "Expert", "Administrateur"]}
              />
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-ad" element={<CreateAdForm />} />
            <Route path="/myads" element={<UserCarList />} />
            <Route path="/edit-car/:id" element={<EditCarAd />} />
            <Route path="/consultation/:jobId" element={<ExpertiseChat />} />
            <Route path="/demande" element={<ExpertsDemande />} />
          </Route>
          {/*//* "Expert" only routes */}
          <Route element={<RequireAuth allowedRoles={["Expert"]} />}></Route>
          <Route path="/requestPasswordReset" element={<ResetPassword />} />
          <Route path="/changePassword/:token" element={<ChangePassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
