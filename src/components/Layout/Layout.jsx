import React, { Fragment } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "../../routers/Routers";
import { Toaster } from "sonner";


const Layout = () => {
  return (
    <Fragment>
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
      <Toaster richColors position="top-center"/>
    </Fragment>
  );
};

export default Layout;
