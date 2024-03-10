import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrades } from "../../features/tradeSlice";
import axios from "axios";
const Trades = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const dispatch = useDispatch();
  const trades = useSelector((state) => state.trades.trades);
  console.log(trades);
  const loading = useSelector((state) => state.trades.loading);
  const error = useSelector((state) => state.trades.error);
  const currentUserData = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserData);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const userTrades = trades.filter((trade) => trade.user === currentUser.id);
  useEffect(() => {
    dispatch(fetchTrades());
  }, [fetchTrades]);
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/subscription/`);
        setSubscriptions(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubscriptions();
  }, [currentUser.id]);
  useEffect(() => {
    let Price = 0;
    let totalStocks = 0;
    userTrades.forEach((trade) => {
      Price += trade.quantity * trade.price;
      totalStocks += trade.quantity;
    });
    setTotalQuantity(totalStocks);
    setTotalPrice(Price);
    console.log(totalPrice, totalQuantity);
  }, [userTrades]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-y-scroll h-[80vh] w-[90%] mt-4 flex gap-4 no-scrollbar mx-auto">
      <div className="flex flex-col w-[50%]">
        <div className="bg-[#202020] p-8 flex gap-2 justify-evenly text-white">
          <div>Stock</div>
          <div>Quantity</div>
          <div>Price</div>
          <div>Date</div>
          <div>Total Value</div>
        </div>
        {userTrades.map((trade) => (
          <div
            key={trade.id}
            className="bg-[#202020] p-8 shadow  border border-b-white flex gap-4 justify-evenly"
          >
            <h3 className="text-lg text-[#5190D8]">{trade.stock_name}</h3>
            <p className="text-white">{trade.quantity}</p>
            <div>
              <p className="text-white">{Number(trade.price).toFixed(2)}</p>
            </div>
            <p className="text-white">
              {new Date(trade.timestamp).toLocaleDateString()}
            </p>
            <p className="text-white">
              ${Number(trade.quantity * trade.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-[50%]">
        <div className="bg-[#202020] p-8 flex gap-4 justify-evenly text-white">
          <div>Subscription ID</div>
          <div>Trader ID</div>
          <div>End Date</div>
          <div>Price</div>
        </div>
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-[#202020] p-8 border border-white shadow  flex gap-4 justify-evenly"
          >
            <p className="text-white">{subscription.id}</p>
            <p className="text-white">{subscription.trader}</p>
            <p className="text-white">{subscription.end_date}</p>
            <p className="text-white">{subscription.price}</p>
          </div>
        ))}
        <div className="bg-[#5190D8] p-8 mt-4 flex gap-4 justify-evenly text-white">
          <div className="text-white">
            Total Price: ${totalPrice.toFixed(2)}
          </div>
          <div className="text-white">Total Quantity: {totalQuantity}</div>
          <div>
            <button>Analyze</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trades;
