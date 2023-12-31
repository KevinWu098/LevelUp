import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest
        .get(
          `/orders?userId=${currentUser._id}&isSeller=${currentUser.isSeller}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;

    const id = sellerId + buyerId;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    try {
      const res = await newRequest.get(
        `/conversations/single/${id}?userId=${currentUser._id}&isSeller=${currentUser.isSeller}`
      );

      navigate(`/message/${res.data.id}`);
    } catch (error) {
      if (error.response.status === 404) {
        const res = await newRequest.post(
          `/conversations?userId=${currentUser._id}&isSeller=${currentUser.isSeller}`,
          {
            to: currentUser.isSeller ? buyerId : sellerId,
          }
        );

        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              {/* {
                                <th>
                                    {currentUser.isSeller ? "Seller" : "Buyer"}
                                </th>
                            } */}
              <th>Contact</th>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className="image" src={order.img} alt="" />
                  </td>
                  <td>{order.title}</td>
                  <td>{order.price}</td>
                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
