import React from "react";

import NavBar from "./NavBar";
import ShowLogo from "./ShowLogo";
import TakeOrder from "./TakeOrder";
import Footer from "./Footer";

function Home() {
  return (
    <>
      <NavBar />
      <div className="grid lg:grid-cols-3 pt-12">
        <div className="lg:col-span-1 lg:border-r-2 lg:border-b-0 border-b-2 ">
          <ShowLogo />
        </div>

        <div className="lg:col-span-2">
          <TakeOrder />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
