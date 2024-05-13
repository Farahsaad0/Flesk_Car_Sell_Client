import React, { Fragment, Suspense } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
// import Routers from "../../routers/Routers";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import Loader from "../loader/Loader";

const Layout = () => {
  return (
    <Fragment>
      <Header />
      <div>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <Toaster richColors position="top-center" />
    </Fragment>
  );
};

export default Layout;
