import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Loader from "react-loader-spinner";
import { Redirect } from "react-router-dom";

import publicIp from "public-ip";
import * as yup from "yup";

import { RoutesFetch } from "../Routes";

function TakeOrder() {
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const [deliveryOption, setDeliveryOption] = useState("deliveryNow");
  const [deliveryWeight, setDeliveryWeight] = useState("1kg");

  const [FromAddress, setFromAddress] = useState("");
  const [FromMobileNumber, setFromMobileNumber] = useState("+91");
  const [DepartDate, setDepartDate] = useState(new Date());
  const [DepartHour, setDepartHour] = useState(
    (new Date().getHours() + 24) % 12 || 12
  );
  const [DepartMinute, setDepartMinute] = useState(new Date().getMinutes());
  const [DepartMeridiem, setDepartMeridiem] = useState(
    new Date().getHours() < 12 ? "AM" : "PM"
  );

  const [ToAddress, setToAddress] = useState("");
  const [ToMobileNumber, setToMobileNumber] = useState("+91");
  const [ArriveDate, setArriveDate] = useState(new Date());
  const [ArriveHour, setArriveHour] = useState(
    (new Date().getHours() + 24) % 12 || 12
  );
  const [ArriveMinute, setArriveMinute] = useState(new Date().getMinutes());
  const [ArriveMeridiem, setArriveMeridiem] = useState(
    new Date().getHours() < 12 ? "AM" : "PM"
  );

  const [Instructions, setInstructions] = useState("");

  const [otpValue, setOtpValue] = useState("");
  const [userOtpValue, setUserOtpValue] = useState("");
  const [showOtpinputs, setShowOtpinputs] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [doredirect, setDoRedirect] = useState(false);

  const [parcelValue, setParcelValue] = useState("");
  const [addSecureValue, setAddSecureValue] = useState(0);
  const [deliveryItemName, setDeliveryItemName] = useState("");
  const [checked, setChecked] = useState(true);

  const [perKm, setPerKm] = useState("");
  const [oneKg, setOneKg] = useState("");
  const [fiveKg, setFiveKg] = useState("");
  const [tenKg, setTenKg] = useState("");
  const [fifteenKg, setFifteenKg] = useState("");
  const [twentyKg, setTwentyKg] = useState("");

  useEffect(() => {
    publicIp.v4().then((ip) => {
      setIpAddress(ip);
    });
  }, []);

  useEffect(() => {
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
      .catch(() => alert("Please retry! Something Went Wrong"));
  }, []);

  const selectDeliveryOptions = (option) => {
    setDeliveryOption(option);
  };

  const selectDeliveryWeight = (option) => {
    setDeliveryWeight(option);
  };

  const SendOtp = () => {
    setLoading(true);

    const createOtpValue = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);

    RoutesFetch("/sendotp/verifyorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: FromMobileNumber,
        otp: createOtpValue,
      }),
    })
      .then((response) => {
        if (response.msg === "fail") {
          alert("Please retry! Something Went Wrong");
        } else {
          setOtpValue(createOtpValue);
          setShowOtpinputs(false);
        }
      })
      .catch(() => alert("Please retry! Something Went Wrong"))
      .finally(() => setLoading(false));
  };

  const Verify = () => {
    const orderValidation = yup.object().shape({
      ipaddress: yup.string().required("Please retry! Something Went Wrong"),
      frommobileNumber: yup
        .string()
        .min(10, "Please Enter Valid Mobile Number")
        .matches(/[0-9]+/gi, "Please Enter Valid Mobile Number")
        .required("First Enter Mobile Number in 'From' column"),
      fromAddress: yup
        .string()
        .required("First Enter Address in 'From' column"),
      tomobileNumber: yup
        .string()
        .min(10, "Please Enter Valid Mobile Number")
        .matches(/[0-9]+/gi, "Please Enter Valid Mobile Number")
        .required("First Enter Mobile Number in 'To' column"),
      toAddress: yup.string().required("First Enter Address in 'To' column"),
      deliveritemName: yup
        .string()
        .required("Please tell us what are you sending."),
    });

    orderValidation
      .validate({
        ipaddress: ipAddress,
        frommobileNumber: FromMobileNumber,
        fromAddress: FromAddress,
        tomobileNumber: ToMobileNumber,
        toAddress: ToAddress,
        deliveritemName: deliveryItemName,
      })
      .then(() => {
        if (deliveryOption === "deliverySchedule") {
          if (
            DepartDate === "" ||
            DepartHour === "" ||
            DepartMinute === "" ||
            ArriveDate === "" ||
            ArriveHour === "" ||
            ArriveMinute === "" ||
            DepartHour > 12 ||
            DepartHour > 59 ||
            ArriveHour > 12 ||
            ArriveMinute > 59
          ) {
            alert("Enter a Valid Date & Time");
          } else if (
            DepartDate === ArriveDate &&
            DepartHour === ArriveHour &&
            DepartMinute === ArriveMinute &&
            DepartMeridiem === ArriveMeridiem
          ) {
            alert("Depart & Arrive time can not be same");
          } else {
            SendOtp();
          }
        } else {
          SendOtp();
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const submitOrder = () => {
    setLoading(true);

    const secureParcel = addSecureValue === 0 ? "No" : "Yes";

    RoutesFetch("/saveitem/sendordertoadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ipAddress,
        fromMobileNumber: FromMobileNumber,
        fromAddress: FromAddress,
        toMobileNumber: ToMobileNumber,
        toAddress: ToAddress,
        charges: "5",
        weight: deliveryWeight,
        deliveryOption: deliveryOption,
        departDate: DepartDate.toDateString(),
        departTime: `${DepartHour} : ${DepartMinute} ${DepartMeridiem}`,
        arriveDate: ArriveDate.toDateString(),
        arriveTime: `${ArriveHour} : ${ArriveMinute} ${ArriveMeridiem}`,
        instructions: Instructions,
        secureParcel,
        deliveryItemName,
      }),
    })
      .then((response) => {
        if (response.msg === "fail") {
          alert("Please retry! Something Went Wrong");
        } else {
          setDeliveryOption("deliveryNow");
          setDeliveryWeight("1kg");
          setFromAddress("");
          setFromMobileNumber("+91");
          setDepartDate(new Date());
          setDepartHour((new Date().getHours() + 24) % 12 || 12);
          setDepartMinute(new Date().getMinutes());
          setDepartMeridiem(new Date().getHours() < 12 ? "AM" : "PM");
          setToAddress("");
          setToMobileNumber("+91");
          setArriveDate(new Date());
          setArriveHour((new Date().getHours() + 24) % 12 || 12);
          setArriveMinute(new Date().getMinutes());
          setArriveMeridiem(new Date().getHours() < 12 ? "AM" : "PM");
          setInstructions("");
          setOtpValue("");
          setUserOtpValue("");
          setShowOtpinputs(true);
          setRedirect(true);
          setParcelValue("");
          setAddSecureValue(0);
          setDeliveryItemName("");
        }
      })
      .catch(() => alert("Please retry! Something Went Wrong"))
      .finally(() => setLoading(false));
  };

  const Submit = () => {
    const otpValidation = yup.object().shape({
      otp: yup
        .string()
        .required("Enter your OTP")
        .min(4, "Please enter a valid OTP")
        .matches(otpValue, "Incorrect OTP"),
    });

    otpValidation
      .validate({
        otp: userOtpValue,
      })
      .then(() => {
        if (deliveryOption === "deliverySchedule") {
          if (
            DepartDate === "" ||
            DepartHour === "" ||
            DepartMinute === "" ||
            ArriveDate === "" ||
            ArriveHour === "" ||
            ArriveMinute === "" ||
            DepartHour > 12 ||
            DepartHour > 59 ||
            ArriveHour > 12 ||
            ArriveMinute > 59
          ) {
            alert("Enter a Valid Date & Time");
          } else if (
            DepartDate === ArriveDate &&
            DepartHour === ArriveHour &&
            DepartMinute === ArriveMinute &&
            DepartMeridiem === ArriveMeridiem
          ) {
            alert("Depart & Arrive time can not be same");
          } else {
            submitOrder();
          }
        } else {
          submitOrder();
        }
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (redirect === true) {
    setTimeout(() => {
      setDoRedirect(true);
    }, 2000);
  }

  if (doredirect === true) {
    return <Redirect to="/myorders" />;
  }

  return (
    <div>
      <div className="sm:flex justify-center items-center">
        <div
          class="p-4 sm:w-1/3 w-full cursor-pointer"
          onClick={() =>
            showOtpinputs === true ? selectDeliveryOptions("deliveryNow") : null
          }
        >
          <div
            class={
              deliveryOption === "deliveryNow"
                ? "border-2 border-yellow-500 p-4 rounded-lg md:h-36 sm:h-40 h-auto"
                : "border-2 border-gray-200 p-4 rounded-lg md:h-36 sm:h-40 h-auto hover:border-black"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            <h2 className="title-font font-medium text-xl text-black">
              Deliver Now
            </h2>
            <p className="leading-relaxed text-gray-400 text-xs">
              We will assign the nearest courier to pick-up and deliver as soon
              as possible.
            </p>
          </div>
        </div>

        <div
          className="p-4 sm:w-1/3 w-full cursor-pointer"
          onClick={() =>
            showOtpinputs === true
              ? selectDeliveryOptions("deliverySchedule")
              : null
          }
        >
          <div
            className={
              deliveryOption === "deliverySchedule"
                ? "border-2 border-yellow-500 p-4 rounded-lg md:h-36 sm:h-40 h-auto"
                : "border-2 border-gray-200 p-4 rounded-lg md:h-36 sm:h-40 h-auto hover:border-black"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            <h2 className="title-font font-medium text-xl text-black">
              Schedule
            </h2>
            <p className="leading-relaxed text-gray-400 text-xs">
              We will arrive at each address at specified times.
            </p>
          </div>
        </div>
      </div>

      <div className="px-10 py-5">
        <div className="pb-5">
          <h2 className="title-font font-medium text-xl text-black">Weight</h2>
        </div>

        <div className="sm:flex ">
          <div className="flex justify-center sm:pb-0 pb-3">
            <div
              className={
                deliveryWeight === "1kg"
                  ? "border px-2 py-1 border-yellow-500 mx-4 cursor-pointer"
                  : "border px-2 py-1 hover:border-gray-400 mx-4 cursor-pointer"
              }
              onClick={() =>
                showOtpinputs === true ? selectDeliveryWeight("1kg") : null
              }
            >
              <p
                className={
                  deliveryWeight === "1kg"
                    ? "leading-relaxed text-yellow-500 md:text-base sm:text-sm text-xs"
                    : "leading-relaxed text-gray-400 md:text-base sm:text-sm text-xs"
                }
              >
                up to 1kg
              </p>
            </div>
            <div
              className={
                deliveryWeight === "5kg"
                  ? "border px-2 py-1 border-yellow-500  mx-4 cursor-pointer"
                  : "border px-2 py-1 hover:border-gray-400 mx-4 cursor-pointer"
              }
              onClick={() =>
                showOtpinputs === true ? selectDeliveryWeight("5kg") : null
              }
            >
              <p
                className={
                  deliveryWeight === "5kg"
                    ? "leading-relaxed text-yellow-500 md:text-base sm:text-sm text-xs"
                    : "leading-relaxed text-gray-400 md:text-base sm:text-sm text-xs"
                }
              >
                up to 5kg
              </p>
            </div>
          </div>
          <div className="flex justify-center sm:pb-0 pb-3">
            <div
              className={
                deliveryWeight === "10kg"
                  ? "border px-2 py-1 border-yellow-500  mx-4 cursor-pointer"
                  : "border px-2 py-1 hover:border-gray-400 mx-4 cursor-pointer"
              }
              onClick={() =>
                showOtpinputs === true ? selectDeliveryWeight("10kg") : null
              }
            >
              <p
                className={
                  deliveryWeight === "10kg"
                    ? "leading-relaxed text-yellow-500 md:text-base sm:text-sm text-xs"
                    : "leading-relaxed text-gray-400 md:text-base sm:text-sm text-xs"
                }
              >
                up to 10kg
              </p>
            </div>

            <div
              className={
                deliveryWeight === "15kg"
                  ? "border px-2 py-1 border-yellow-500 mx-4 cursor-pointer"
                  : "border px-2 py-1 hover:border-gray-400 mx-4 cursor-pointer"
              }
              onClick={() =>
                showOtpinputs === true ? selectDeliveryWeight("15kg") : null
              }
            >
              <p
                className={
                  deliveryWeight === "15kg"
                    ? "leading-relaxed text-yellow-500 md:text-base sm:text-sm text-xs"
                    : "leading-relaxed text-gray-400 md:text-base sm:text-sm text-xs"
                }
              >
                up to 15kg
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className={
                deliveryWeight === "20kg"
                  ? "border px-2 py-1 border-yellow-500 mx-4 cursor-pointer"
                  : "border px-2 py-1 hover:border-gray-400 mx-4 cursor-pointer"
              }
              onClick={() =>
                showOtpinputs === true ? selectDeliveryWeight("20kg") : null
              }
            >
              <p
                className={
                  deliveryWeight === "20kg"
                    ? "leading-relaxed text-yellow-500 md:text-base sm:text-sm text-xs"
                    : "leading-relaxed text-gray-400 md:text-base sm:text-sm text-xs"
                }
              >
                up to 20kg
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500 p-5 m-5 rounded">
        <div className="pb-5">
          <h2 className="title-font font-medium text-xl text-white">① From</h2>
        </div>

        <div>
          <div>
            <label
              for="fromaddress"
              className="leading-7 text-sm text-gray-600"
            >
              Address
            </label>
            <textarea
              id="fromaddress"
              name="fromaddress"
              className="w-full bg-white rounded h-20 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              value={FromAddress}
              onChange={(event) =>
                showOtpinputs === true
                  ? setFromAddress(event.target.value)
                  : null
              }
            ></textarea>
          </div>

          <div className="mb-5">
            <label for="frommobileno" class="leading-7 text-sm text-gray-600">
              Mobile Number
            </label>
            <input
              type="tel"
              id="frommobileno"
              name="frommobileno"
              maxLength="13"
              class="w-full bg-white rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={FromMobileNumber}
              onChange={(event) =>
                showOtpinputs === true
                  ? setFromMobileNumber(event.target.value)
                  : null
              }
            />
          </div>

          {deliveryOption === "deliveryNow" ? null : (
            <div className="sm:flex mb-4 mt-10">
              <label for="depart" class="leading-7 text-sm text-gray-600 pr-5">
                Depart
              </label>
              <div className="flex justify-center sm:pt-0 pt-2">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  className="py-2 text-center rounded"
                  selected={DepartDate}
                  onChange={(date) => setDepartDate(date)}
                />
              </div>
              <div className="flex justify-center sm:pt-0 pt-5">
                <input
                  type="time"
                  id="departtimehour"
                  name="departtimehour"
                  maxLength="2"
                  class="sm:ml-5 ml-0 w-12 bg-white rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={DepartHour}
                  onChange={(event) => setDepartHour(event.target.value)}
                />
                <p className="text-white text-2xl py-1 ml-1">:</p>
                <input
                  type="time"
                  id="departtimeminute"
                  name="departtimeminute"
                  maxLength="2"
                  class="ml-1 w-12 bg-white rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={DepartMinute}
                  onChange={(event) => setDepartMinute(event.target.value)}
                />
                <select
                  className="ml-4"
                  id="departtimemeridiem"
                  name="departtimemeridiem"
                  value={DepartMeridiem}
                  onChange={(event) => setDepartMeridiem(event.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-500 p-5 m-5 mt-10 rounded">
        <div className="pb-5">
          <h2 className="title-font font-medium text-xl text-white">② To</h2>
        </div>

        <div>
          <div>
            <label for="toaddress" className="leading-7 text-sm text-gray-600">
              Address
            </label>
            <textarea
              id="toaddress"
              name="toaddress"
              className="w-full bg-white rounded h-20 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              value={ToAddress}
              onChange={(event) =>
                showOtpinputs === true ? setToAddress(event.target.value) : null
              }
            ></textarea>
          </div>

          <div className="mb-5">
            <label for="tomobileno" class="leading-7 text-sm text-gray-600">
              Mobile Number
            </label>
            <input
              type="tel"
              id="tomobileno"
              name="tomobileno"
              maxLength="13"
              class="w-full bg-white rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={ToMobileNumber}
              onChange={(event) =>
                showOtpinputs === true
                  ? setToMobileNumber(event.target.value)
                  : null
              }
            />
          </div>

          {deliveryOption === "deliveryNow" ? null : (
            <div className="sm:flex  mb-4 mt-10">
              <label for="arrive" class="leading-7 text-sm text-gray-600 pr-5">
                Arrive
              </label>
              <div className="flex justify-center sm:pt-0 pt-2">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  className="py-2 text-center rounded"
                  selected={ArriveDate}
                  onChange={(date) => setArriveDate(date)}
                />
              </div>
              <div className="flex justify-center sm:pt-0 pt-5">
                <input
                  type="time"
                  id="arrivetimehour"
                  name="arrivetimehour"
                  maxLength="2"
                  class="sm:ml-5 ml-0 w-12 bg-white rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={ArriveHour}
                  onChange={(event) => setArriveHour(event.target.value)}
                />
                <p className="text-white text-2xl py-1 ml-1">:</p>
                <input
                  type="time"
                  id="arrivetimeminute"
                  name="arrivetimeminute"
                  maxLength="2"
                  class="ml-1 w-12 bg-white rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={ArriveMinute}
                  onChange={(event) => setArriveMinute(event.target.value)}
                />
                <select
                  className="ml-4"
                  id="arrivetimemeridiem"
                  name="arrivetimemeridiem"
                  value={ArriveMeridiem}
                  onChange={(event) => setArriveMeridiem(event.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="m-5 mt-10">
        <textarea
          id="instruction"
          name="instruction"
          placeholder="Any Instructions..."
          className="w-full bg-white rounded border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
          value={Instructions}
          onChange={(event) => setInstructions(event.target.value)}
        ></textarea>
      </div>

      <div className="m-5">
        <div class="border-2 border-gray-200 p-4 rounded-lg">
          <input
            placeholder="What are you sending?"
            type="text"
            class="w-full bg-gray-200 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={deliveryItemName}
            onChange={(event) =>
              showOtpinputs === true
                ? setDeliveryItemName(event.target.value)
                : null
            }
          />
        </div>
      </div>

      <div className="m-5">
        <div class="border-2 border-gray-200 p-4 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h2 className="title-font font-medium text-xl text-black">
            Secure Your Parcel
          </h2>
          <div>
            <input
              type="text"
              id="secureparcel"
              name="secureparcel"
              maxLength="5"
              class="mt-3 bg-gray-200 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="Parcel Value"
              value={parcelValue}
              onChange={(event) => {
                const regex = /^[0-9\b]+$/;

                if (
                  event.target.value === "" ||
                  regex.test(event.target.value)
                ) {
                  // eslint-disable-next-line no-unused-expressions
                  showOtpinputs === true
                    ? setParcelValue(event.target.value)
                    : null;
                  // eslint-disable-next-line no-unused-expressions
                  showOtpinputs === true
                    ? event.target.value === ""
                      ? setAddSecureValue(0)
                      : setAddSecureValue(
                          Math.ceil(parseInt(event.target.value) * 0.15)
                        )
                    : null;
                }
              }}
            />
            <p className="leading-relaxed text-gray-400 text-xs pt-3 pl-2">
              ₹ {addSecureValue} : Additional charges for securing parcel
            </p>
          </div>
        </div>
      </div>

      <div className="m-5">
        <div class="border-2 border-gray-200 p-4 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="title-font font-medium text-xl text-black">
            Payment Type
          </h2>
          <p className="leading-relaxed text-gray-400 text-xs">
            Currently we only deal in cash.
          </p>
        </div>
      </div>

      {showOtpinputs === true ? (
        <div>
          <div
            className="flex justify-center cursor-pointer bg-yellow-500 border-0 p-2 m-5 focus:outline-none hover:bg-yellow-600 rounded h-12"
            onClick={() => (loading === false ? Verify() : null)}
          >
            {loading === false ? (
              <p className="flex items-center text-white text-lg text-center">
                Verify Order
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
      ) : null}

      {showOtpinputs === false ? (
        <div>
          <div className=" mx-5 rounded">
            <div className="mb-3">
              <label for="otp" class="leading-7 text-sm text-black">
                OTP
              </label>
              <input
                type="tel"
                id="otp"
                name="otp"
                maxLength="4"
                class="w-full bg-white border-2 border-gray-200 rounded text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={userOtpValue}
                onChange={(event) => setUserOtpValue(event.target.value)}
              />
            </div>
          </div>

          <div className="mx-5 flex">
            <input
              className="mt-0.5"
              type="checkbox"
              defaultChecked={checked}
              onClick={() => {
                checked === true ? setChecked(false) : setChecked(true);
              }}
            />
            <p className="leading-relaxed text-gray-400 text-xs pl-2">
              Agree to our terms & conditions
            </p>
          </div>

          <div
            className="flex cursor-pointer justify-center bg-yellow-500 border-0 p-2 m-5 focus:outline-none hover:bg-yellow-600 rounded h-12"
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              checked === false
                ? alert("First agree to our terms & conditions")
                : loading === false
                ? Submit()
                : null;
            }}
          >
            {loading === false ? (
              <p className="flex items-center text-white text-lg text-center">
                Submit Order
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
      ) : null}

      {redirect === true ? (
        <p className="text-center text-gray-500">
          Order Sent Successfully! Check{" "}
          <span style={{ color: "orange", fontWeight: "bold" }}>
            'My Orders'
          </span>{" "}
          Panel.
        </p>
      ) : null}
    </div>
  );
}

export default TakeOrder;
