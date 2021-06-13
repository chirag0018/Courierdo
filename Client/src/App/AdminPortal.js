import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Loader from "react-loader-spinner";

import delivery_icon from "../icons/delivery_icon.png";
import { RoutesFetch } from "../Routes";

function AdminPortal() {
  const [redirect, setRedirect] = useState("");

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("login") === "OnlyAdmin") {
      setRedirect("AdminPanel");
    }
  }, []);

  const Login = () => {
    if (userName === "" || password === "") {
      alert("First Enter Login Details");
    } else {
      setLoading(true);
      RoutesFetch("/adminpanel/getaccess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      })
        .then(async (response) => {
          if (response.msg === "fail") {
            alert("Incorrect Username & Password");
          } else {
            await localStorage.setItem("login", "OnlyAdmin");
            await setRedirect("AdminPanel");
          }
        })
        .catch(() => {
          alert("Please retry! Something Went Wrong");
        })
        .finally(() => setLoading(false));
    }
  };

  if (redirect === "AdminPanel") {
    return <Redirect to="/adminpanel" />;
  }

  return (
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto md:flex  ">
        <div class="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h2 class="text-center title-font text-6xl font-medium text-black mb-6">
            Courier<span style={{ color: "orange" }}>do</span>
          </h2>

          <div className="flex justify-center">
            <img alt="*" src={delivery_icon} />
          </div>
        </div>
        <div class="lg:w-2/6 md:w-1/2 border-2 border-gray-200 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 class="text-gray-900 text-lg font-medium title-font mb-5">
            Sign in
          </h2>
          <div class="relative mb-4">
            <label for="full-name" class="leading-7 text-sm text-gray-600">
              User Name
            </label>
            <input
              type="text"
              id="user-name"
              name="user-name"
              class="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>
          <div class="relative mb-4">
            <label for="email" class="leading-7 text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div
            className="flex justify-center bg-yellow-500 border-0 p-2 focus:outline-none hover:bg-yellow-600 rounded h-12"
            onClick={() => Login()}
          >
            {loading === false ? (
              <p className="flex items-center text-white text-lg text-center">
                Log In
              </p>
            ) : (
              <Loader
                className="flex items-center"
                type="TailSpin"
                color="#fff"
                height={20}
                width={20}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPortal;
