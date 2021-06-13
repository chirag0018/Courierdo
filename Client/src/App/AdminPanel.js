import React, { useState, useEffect } from "react";

import { HashLink } from "react-router-hash-link";
import { Redirect } from "react-router-dom";

function AdminPanel() {
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    if (localStorage.getItem("login") !== "OnlyAdmin") {
      setRedirect("AdminPortal");
    }
  }, []);

  if (redirect === "AdminPortal") {
    return <Redirect to="/adminportal" />;
  }

  return (
    <div>
      <div class="mt-10 ml-10 flex justify-content">
        <button
          onClick={() => {
            localStorage.setItem("login", "");
            setRedirect("AdminPortal");
          }}
          class="flex-shrink-0 text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg mt-10 sm:mt-0"
        >
          Logout
        </button>
      </div>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-14 mx-auto">
          <div class="lg:w-2/3 flex flex-col sm:flex-row items-center mx-auto">
            <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">
              Order Not Reviewed
            </h1>
            <HashLink to="/order/notreviewed">
              <button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">
                Show
              </button>
            </HashLink>
          </div>
        </div>
      </section>
      <div style={{ borderWidth: 1, width: "100%" }}></div>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-14 mx-auto">
          <div class="lg:w-2/3 flex flex-col sm:flex-row items-center  mx-auto">
            <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">
              Order Reviewed
            </h1>
            <HashLink to="/order/reviewed">
              <button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">
                Show
              </button>
            </HashLink>
          </div>
        </div>
      </section>
      <div style={{ borderWidth: 1, width: "100%" }}></div>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-14 mx-auto">
          <div class="lg:w-2/3 flex flex-col sm:flex-row items-center  mx-auto">
            <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">
              Order Delivered
            </h1>
            <HashLink to="/order/delivered">
              <button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">
                Show
              </button>
            </HashLink>
          </div>
        </div>
      </section>
      <div style={{ borderWidth: 1, width: "100%" }}></div>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-14 mx-auto">
          <div class="lg:w-2/3 flex flex-col sm:flex-row items-center  mx-auto">
            <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">
              Charges
            </h1>
            <HashLink to="/order/charges">
              <button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">
                Change
              </button>
            </HashLink>
          </div>
        </div>
      </section>
      <div style={{ borderWidth: 1, width: "100%" }}></div>
    </div>
  );
}

export default AdminPanel;
