/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import Loader from "react-loader-spinner";
import publicIp from "public-ip";
import socketIOClient from "socket.io-client";

import { RoutesFetch } from "../Routes";

const socket = socketIOClient();

function MyOrders() {
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [itemsLength, setItemLength] = useState(null);

  useEffect(() => {
    socket.on("orderReviewDone", (orderReview) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i]._id === orderReview.id) {
          if (orderReview.review === "Accept") {
            items[i].isOrderAccepted = "OrderAccepted";
            setItems([...items]);
          } else {
            items[i].isOrderAccepted = "OrderNotAccepted";
            setItems([...items]);
          }
        }
      }
    });

    socket.on("orderDeliveredDone", (orderDelivered) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i]._id === orderDelivered.id) {
          items[i].isOrderDelivered = "Delivered";
          setItems([...items]);
        }
      }
    });
  }, [items]);

  const LoadItems = () => {
    publicIp
      .v4()
      .then((ip) => {
        RoutesFetch("/fetchitem/myorderitem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ipAddress: ip,
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
          .catch(() => alert("Please retry! Something Went Wrong"));
      })
      .catch(() => {
        setLoading(false);
        alert("Please retry! Something Went Wrong");
      })
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);

    LoadItems();
  }, []);

  return (
    <div>
      <header class="text-white body-font bg-yellow-500">
        <div className="flex">
          <div class="p-5 ">
            <HashLink to="/" class="ml-3 text-sm">
              « Back
            </HashLink>
          </div>
          <div className="p-5 text-white">My Orders</div>
        </div>
      </header>

      {loading === true ? (
        <div className="flex justify-center mt-10">
          <Loader
            className="flex items-center"
            type="TailSpin"
            color="orange"
            height={30}
            width={30}
          />
        </div>
      ) : (
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
                <p class="leading-relaxed text-base">
                  Address : {item.toAddress}
                </p>
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

              <div className="flex justify-center">
                {item.isOrderAccepted === "NotDefined" ? (
                  <h2 class="text-indigo-500 text-lg title-font font-medium mb-3">
                    Currently your order is in under review.
                  </h2>
                ) : item.isOrderAccepted === "OrderNotAccepted" ? (
                  <h2 class="text-red-500 text-lg title-font font-medium mb-3">
                    Sorry! Currently we are not able to reach your location.
                  </h2>
                ) : (
                  <h2 class="text-green-500 text-lg title-font font-medium mb-3">
                    We are all set to deliver your order.
                  </h2>
                )}
              </div>

              <div className="flex justify-center">
                {item.isOrderAccepted === "NotDefined" ||
                item.isOrderAccepted === "OrderNotAccepted" ||
                item.isOrderDelivered === "NotDelivered" ? null : (
                  <h2 class="text-yellow-500 text-lg title-font font-medium mb-3">
                    Your order was successfully delivered.
                  </h2>
                )}
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
      )}
    </div>
  );
}

export default MyOrders;
