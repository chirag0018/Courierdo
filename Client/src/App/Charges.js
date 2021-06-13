/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import * as yup from "yup";

import { RoutesFetch } from "../Routes";

function Charges() {
  const [loading, setLoading] = useState(false);
  const [priceloading, setPriceLoading] = useState(false);

  const [perKm, setPerKm] = useState("");
  const [oneKg, setOneKg] = useState("");
  const [fiveKg, setFiveKg] = useState("");
  const [tenKg, setTenKg] = useState("");
  const [fifteenKg, setFifteenKg] = useState("");
  const [twentyKg, setTwentyKg] = useState("");

  useEffect(() => {
    setPriceLoading(true);

    RoutesFetch("/fetchPrice/touserorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.msg === "fail") {
          alert("Please retry! Something Went Wrong");
        } else {
          setPerKm(response.perKm);
          setOneKg(response.uptoOnekg);
          setFiveKg(response.uptoFivekg);
          setTenKg(response.uptoTenkg);
          setFifteenKg(response.uptoFifteenkg);
          setTwentyKg(response.uptoTwentykg);
        }
      })
      .catch(() => alert("Please retry! Something Went Wrong"))
      .finally(() => {
        setPriceLoading(false);
      });
  }, []);

  const Submit = () => {
    const Validation = yup.object().shape({
      notEmpty: yup.string().required("Empty input not allowed"),
    });

    Validation.validate({
      notEmpty: perKm,
      notEmpty: oneKg,
      notEmpty: fiveKg,
      notEmpty: tenKg,
      notEmpty: fifteenKg,
      notEmpty: twentyKg,
    })
      .then(() => {
        RoutesFetch("/changeprice/touserorders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            perKm,
            oneKg,
            fiveKg,
            tenKg,
            fifteenKg,
            twentyKg,
          }),
        })
          .then((response) => {
            if (response.msg === "fail") {
              alert("Please retry! Something Went Wrong");
            } else {
              alert("Order Charges Change Successfully!");
            }
          })
          .catch(() => alert("Please retry! Something Went Wrong"));
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (priceloading === true) {
    return (
      <div className="flex justify-center mt-10">
        <Loader
          className="flex items-center"
          type="TailSpin"
          color="orange"
          height={30}
          width={30}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="border border-yellow-500 p-5 m-5 mt-10 rounded">
        <div className="pb-5">
          <h2 className="title-font font-medium text-xl text-yellow-500">
            Change Charges
          </h2>
        </div>

        <div className="mb-5">
          <label class="leading-7 text-sm text-gray-600">per Km</label>
          <input
            type="text"
            class="w-full border border-yellow-500 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={perKm}
            onChange={(event) => setPerKm(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <label class="leading-7 text-sm text-gray-600">upto 1 kg</label>
          <input
            type="text"
            class="w-full border border-yellow-500 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={oneKg}
            onChange={(event) => setOneKg(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <label class="leading-7 text-sm text-gray-600">upto 5 kg</label>
          <input
            type="text"
            class="w-full border border-yellow-500 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={fiveKg}
            onChange={(event) => setFiveKg(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <label class="leading-7 text-sm text-gray-600">upto 10 kg</label>
          <input
            type="text"
            class="w-full border border-yellow-500 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={tenKg}
            onChange={(event) => setTenKg(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <label class="leading-7 text-sm text-gray-600">upto 15 kg</label>
          <input
            type="text"
            class="w-full border border-yellow-500 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={fifteenKg}
            onChange={(event) => setFifteenKg(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <label class="leading-7 text-sm text-gray-600">upto 20 kg</label>
          <input
            type="text"
            class="w-full border border-yellow-500 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={twentyKg}
            onChange={(event) => setTwentyKg(event.target.value)}
          />
        </div>
      </div>

      <div>
        <div
          className="flex justify-center cursor-pointer bg-yellow-500 border-0 p-2 m-5 focus:outline-none hover:bg-yellow-600 rounded h-12"
          onClick={() => (loading === false ? Submit() : null)}
        >
          {loading === false ? (
            <p className="flex items-center text-white text-lg text-center">
              Submit
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
  );
}

export default Charges;
