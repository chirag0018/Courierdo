/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import { Redirect } from "react-router-dom";
import socketIOClient from "socket.io-client";

import { RoutesFetch } from "../Routes";

const socket = socketIOClient();

function OrderReviewed() {
  const [redirect, setRedirect] = useState("");
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const [Deliveredloading, setDeliveredLoading] = useState(false);
  const [DeliveredloadingId, setDeliveredLoadingId] = useState("");

  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [itemsLength, setItemLength] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("login") !== "OnlyAdmin") {
      setRedirect("AdminPortal");
    }
  }, []);

  const LoadItems = () => {
    RoutesFetch("/fetchitem/accepteditem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page,
      }),
    })
      .then((response) => {
        if (response.msg === "fail") {
          alert("Please retry! Something Went Wrong");
        } else {
          setItems([...items, ...response]);
          setItemLength(response.length);
          setPage(page + 1);
        }
      })
      .catch(() => alert("Please retry! Something Went Wrong"))
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    LoadItems();
  }, []);

  const DeliveredOrder = (id) => {
    RoutesFetch("/itemdelivered/deliverydone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then(async (response) => {
        if (response.msg === "fail") {
          alert("Please retry! Something Went Wrong");
        } else {
          for (let i = 0; i < items.length; i++) {
            if (items[i]._id === id) {
              items.splice(i, 1);
              setItems([...items]);
            }
          }
          await socket.emit("orderDelivered", {
            id,
          });
        }
      })
      .catch(() => alert("Please retry! Something Went Wrong"))
      .finally(() => {
        setDeliveredLoading(false);
      });
  };

  if (redirect === "AdminPortal") {
    return <Redirect to="/adminportal" />;
  }

  if (loading === true) {
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
      {items.map((item) => (
        <div class=" p-5 m-5 border-2 rounded-lg border-gray-200 ">
          <div className="flex mb-3 justify-end">
            <p className="text-xs">
              {new Date(item.createdAt).getDate() +
                " / " +
                new Date(item.createdAt).getMonth() +
                " / " +
                new Date(item.createdAt).getFullYear() +
                " , " +
                new Date(item.createdAt).getHours() +
                " : " +
                new Date(item.createdAt).getMinutes()}
            </p>
          </div>

          <div className="mb-3">
            <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
              From -
            </h2>
            <p class="leading-relaxed text-base">
              Mobile No : {item.fromMobileNumber}
            </p>
            <p class="leading-relaxed text-base">
              Address : {item.fromAddress}
            </p>
            {item.deliveryOption === "deliverySchedule" ? (
              <p class="leading-relaxed text-base">
                Depart At : {item.departDate} , {item.departTime}
              </p>
            ) : null}
          </div>

          <div className="mb-3">
            <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
              To -
            </h2>
            <p class="leading-relaxed text-base">
              Mobile No. : {item.toMobileNumber}
            </p>
            <p class="leading-relaxed text-base">Address : {item.toAddress}</p>
            {item.deliveryOption === "deliverySchedule" ? (
              <p class="leading-relaxed text-base">
                Arrive At : {item.arriveDate} , {item.arriveTime}
              </p>
            ) : null}
          </div>

          {item.instructions === "" ? null : (
            <div className="mb-3">
              <h2 class="text-yellow-500 text-lg title-font font-medium">
                Instructions
              </h2>
              <p class="leading-relaxed text-sm">{item.instructions}</p>
            </div>
          )}

          <div className="mb-3">
            <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
              What to send - {item.deliveryItemName}
            </h2>
          </div>

          <div className="mb-3">
            <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
              Weight - {item.weight}
            </h2>
          </div>

          {item.secureParcel === "No" ? null : (
            <div className="mb-3">
              <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
                Secure Parcel - {item.secureParcel}
              </h2>
            </div>
          )}

          <div className="mb-3">
            <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
              Charges - {item.charges}
            </h2>
          </div>

          <div className="flex justify-end">
            <div
              className="flex justify-center cursor-pointer bg-yellow-500 border-0 p-2 m-3 focus:outline-none hover:bg-yellow-600 rounded h-12"
              onClick={() => {
                Deliveredloading === true
                  ? null
                  : setDeliveredLoadingId(item._id);
                Deliveredloading === true ? null : setDeliveredLoading(true);
                Deliveredloading === true ? null : DeliveredOrder(item._id);
              }}
            >
              {DeliveredloadingId === item._id ? (
                Deliveredloading === true ? (
                  <Loader
                    className="flex items-center"
                    type="TailSpin"
                    color="#fff"
                    height={20}
                    width={20}
                  />
                ) : (
                  <p className="flex items-center text-white text-lg text-center">
                    Delivered
                  </p>
                )
              ) : (
                <p className="flex items-center text-white text-lg text-center">
                  Delivered
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {itemsLength === 0 ? (
        <h2 className="text-center text-base text-gray-500 my-5">
          No More Orders Available
        </h2>
      ) : (
        <div
          className="flex justify-center cursor-pointer bg-yellow-500 border-0 p-2 m-3 focus:outline-none hover:bg-yellow-600 rounded h-12"
          onClick={() => {
            moreLoading === false ? setMoreLoading(true) : null;
            moreLoading === false ? LoadItems() : null;
          }}
        >
          {moreLoading === false ? (
            <p className="flex items-center text-white text-lg text-center">
              Show More
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
      )}
    </div>
  );
}

export default OrderReviewed;
