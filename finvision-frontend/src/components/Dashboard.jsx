import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import io from "socket.io-client";
import "../styles/Dashboard.css";
import axios from "axios";
axios.defaults.withCredentials = true;

const socket = io("http://localhost:5000");

export default function Dashboard({ user }) {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState([]);

  // 🚨 Error popup state
  const [errorPopup, setErrorPopup] = useState({ show: false, msg: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const importError = params.get("importError");
    const message = params.get("message");

    if (importError === "true" && message) {
      setErrorPopup({ show: true, msg: decodeURIComponent(message) });
      // Optional: Clean up URL (remove query params after showing popup)
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  // 🔽 Fetch available symbols (dropdown)
  useEffect(() => {
    axios.get("http://localhost:5000/api/symbols")
      .then(res => {
        console.log("✅ Symbols:", res.data);
        setStockList(res.data);
      })
      .catch(err => console.error("❌ Error loading symbols:", err));
  }, []);

  // 🔁 Fetch chart data & listen to live updates
  useEffect(() => {
    setIsLoading(true);
    setStockData([]);

    axios.get(`http://localhost:5000/api/historical?symbol=${selectedStock}`)
      .then(res => {
        setStockData(res.data);
        setIsLoading(false);
      })
      .catch(err => console.error("❌ Error loading historical data:", err));

    socket.emit("subscribe", selectedStock);

    const handleUpdate = (newData) => {
      if (newData.length > 0) {
        setStockData(prev => [...prev.slice(-49), ...newData]);
      }
    };

    socket.on("stockUpdate", handleUpdate);
    return () => socket.off("stockUpdate", handleUpdate);
  }, [selectedStock]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // store user email here after login
  
    if (!email) return;
  
    axios.get("http://localhost:8000/api/portfolio/holdings", {
      headers: { "x-user-email": email }
    })
    .then(res => {
      setHoldings(res.data.holdings || []);
    })
    .catch(err => console.error("❌ Error fetching holdings:", err));
  }, []);

  const totalInvestment = holdings.reduce((sum, h) => sum + (h.investmentValue || 0), 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
  const totalPnL = holdings.reduce((sum, h) => sum + (h.unrealizedGainLoss || 0), 0);

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name || user?.email || "User"}!</h2> 
      {/* 🚨 ERROR POPUP */}
      {errorPopup.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Import Error</h2>
            <p className="modal-message">{errorPopup.msg}</p>
            <button
              className="modal-button"
              onClick={() => {
                setErrorPopup({ show: false, msg: "" });
                window.location.href = "/dashboard";
              }}
            >
              OK
            </button>
          </div>
        </div>
      )} 
      <div className="portfolio-summary">
        <h3>Portfolio Summary</h3>
        {holdings.length === 0 ? (
          <p>No holdings information. Please link your portfolio.</p>
        ) : (
          <div className="grid">
            <div className="card">
              <h3>Total Investment</h3>
              <p>₹{totalInvestment.toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Current Value</h3>
              <p>₹{totalCurrentValue.toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Total P&amp;L</h3>
              <p style={{ color: totalPnL >= 0 ? "#74ff33" : "#FF5733 " }}>
                ₹{totalPnL.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Stock Market Trends</h3>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            {stockList.map((stock, index) => (
              <option key={index} value={stock.symbol}>
                {stock.symbol} ({stock.exchange})
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockData}>
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4CAF7D"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="holdings-section">
        <h3>Your Holdings</h3>
        {holdings.length === 0 ? (
          <p>No holdings uploaded yet.</p>
        ) : (
          <div className="holdings-table-container">
            <table className="holdings-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>ISIN</th>
                  <th>Quantity</th>
                  <th>Avg Price</th>
                  <th>Current Price</th>
                  <th>Investment</th>
                  <th>Current Value</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, idx) => (
                  <tr key={idx}>
                    <td>{h.symbol}</td>
                    <td>{h.isin}</td>
                    <td>{h.quantity}</td>
                    <td>{h.avgPrice}</td>
                    <td>{h.currentPrice}</td>
                    <td>{h.investmentValue}</td>
                    <td>{h.currentValue}</td>
                    <td style={{ color: h.unrealizedGainLoss >= 0 ? "green" : "red" }}>
                      {h.unrealizedGainLoss}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
