import React, { useState, useEffect } from "react";
import "../styles/Predictor.css";
import axios from "axios";

const Predictor = () => {
  const [symbols, setSymbols] = useState([]);
  const [selected, setSelected] = useState("");
  const [historicalData, setHistoricalData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔽 Load available stock symbols
  useEffect(() => {
    axios.get("https://fsd-app-frontend.onrender.com/api/symbols")
      .then((res) => {
        setSymbols(res.data);
        if (res.data.length > 0) {
          setSelected(res.data[0].symbol);
        }
      })
      .catch((err) => console.error("❌ Error loading symbols:", err));
  }, []);

  // 🔁 Fetch historical data when selected symbol changes
  useEffect(() => {
    if (!selected) return;

    setLoading(true);
    axios.get(`https://fsd-app-frontend.onrender.com/api/historical?symbol=${selected}`)
      .then((res) => {
        //console.log("📦 Raw historical data response:", res.data); 

        const prices = res.data.map(item => ({ close: item.price }));

        //console.log("✅ Cleaned historical data:", prices); 
        setHistoricalData(prices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading historical data:", err);
        setLoading(false);
      });
  }, [selected]);

  const handlePredict = () => {
    if (historicalData?.length === 0) {
      console.error("❌ No historical data available to predict.");
      return;
    }

    axios.post("http://localhost:5001/predict", {
      symbol: selected,
      historical: historicalData, // same format as Dashboard
    }, { withCredentials: true })
    .then((res) => {
      setPrediction(res.data);
    })
    .catch((err) => {
      console.error("❌ Prediction error:", err);
      setPrediction(null);
    });
  };

  return (
    <div className="predictor-widget">
      <h3>📊 Stock Movement Predictor</h3>
      <div className="form">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {symbols.map((s) => (
            <option key={s.symbol} value={s.symbol}>{s.symbol} ({s.exchange})</option>
          ))}
        </select>
        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Loading..." : "Predict"}
        </button>
      </div>
      {prediction && (
        <div className="result">
          <p>🔮 <strong>{selected}</strong>: {prediction.trend} expected</p>
          <p>Confidence: {prediction.confidence}%</p>
        </div>
      )}
    </div>
  );
};

export default Predictor;
