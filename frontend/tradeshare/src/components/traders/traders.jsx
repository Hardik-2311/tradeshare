import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTraders } from "../../features/tradersSlice";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Traders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const traders = useSelector((state) => state.traders.traders);
  const [selectedTrader, setSelectedTrader] = useState(null);

  useEffect(() => {
    dispatch(fetchTraders());
  }, [dispatch]);

  const handleTraderClick = (trader) => {
    navigate("/tdash");
  };
  const currentUserData = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserData);
  const handlesubmission = async (traderId, clientId) => {
    const data = {
      client: clientId,
      trader: traderId,
      start_date: "2022-03-11",
      end_date: "2022-04-11",
      price: 500,
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/subscription/",
      data
    );
    console.log(response);
  };
  return (
    <div className="container mx-auto overflow-y-scroll h-[80vh]">
      <h1 className="text-3xl font-bold my-4">Traders</h1>
      <div className="flex flex-col gap-4">
        {traders.map((trader, index) => (
          <div
            key={index}
            className="bg-[#202020] p-4 text-white rounded shadow flex justify-evenly items-center w-[90%] mx-auto"
          >
            <h2 className="text-xl font-semibold">{trader.username}</h2>
            <h2 className="text-xl font-semibold">{trader.id}</h2>
            <p>Winrate: {trader.winrate}%</p>
            <p>Total Gain: ${trader.total_gain}</p>
            <p>Average Return: {trader.average_return}%</p>
            <p>Trades: {trader.total_trades}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handlesubmission(trader.id, currentUser.id);
              }}
            >
              premium
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Traders;
