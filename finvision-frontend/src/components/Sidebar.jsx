import "../styles/Sidebar.css";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

export default function Sidebar() {
  const [holdings, setHoldings] = useState([]);

  // 🔽 Fetch Holdings Data
  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // must be set after login
    if (!email) return;

    axios.get("http://localhost:8000/api/portfolio/holdings", {
      headers: { "x-user-email": email }
    })
    .then(res => {
      setHoldings(res.data.holdings || []);
    })
    .catch(err => console.error("❌ Error fetching holdings:", err));
  }, []);

  // If holdings are not ready yet, skip calculation to avoid 'undefined' errors
  if (!holdings || holdings.length === 0) {
    return (
      <aside className="sidebar">
        <h2>Portfolio Summary</h2>
        <p>No holdings available. Please link your portfolio.</p>
      </aside>
    );
  }

  const totalInvestment = holdings.reduce((acc, h) => acc + (h.investmentValue || 0), 0);
  const allocationData = holdings.map(h => ({
    name: h.symbol,
    value: totalInvestment > 0 
    ? parseFloat((((h.investmentValue || 0) / totalInvestment) * 100).toFixed(2))
    : 0
  }));

  const profitLossData = [
    {
      name: "Profit",
      value: holdings.filter(h => h.unrealizedGainLoss >= 0).reduce((acc, h) => acc + (h.currentValue || 0), 0),
    },
    {
      name: "Loss",
      value: holdings.filter(h => h.unrealizedGainLoss < 0).reduce((acc, h) => acc + (h.currentValue || 0), 0),
    }
  ];

  // Color palettes
  const allocationColors = [
    "#FF6B6B", // Coral Red
    "#FFD93D", // Sun Yellow
    "#6BCB77", // Fresh Green
    "#4D96FF", // Bright Blue
    "#F38BA0", // Soft Pink
    "#6A4C93", // Royal Purple
    "#FFB562", // Peachy Orange
    "#43AA8B", // Teal Green
    "#9D4EDD", // Vibrant Violet
    "#EF476F"  // Raspberry
  ];
  const profitLossColors = ["#6bcb4e", "#eb5c2a"]; // Green and Red only

  const watchlist = [
    { name: "AMZN", price: "$3,204.50", change: "-0.45%" },
    { name: "GOOGL", price: "$2,785.58", change: "+1.15%" },
    { name: "TWTR", price: "$899.41", change: "+2.30%" },
  ];

  return (
    <aside className="sidebar">
      <h2>Visualize Your Holdings</h2>

      <div className="pie-chart-container">
        <h3>Allocation by Stock</h3>
        <ResponsiveContainer width="100%" height={290}>
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
              innerRadius="50%" 
              fill="#8884d8"
              label={({ value }) => `${value.toFixed(2)}%`}
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-alloc-${index}`} fill={allocationColors[index % allocationColors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Allocation"]}/>
            <Legend 
              verticalAlign="bottom"
              align="left"
              layout="horizontal"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="pie-chart-container">
        <h3>Profit vs Loss</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={profitLossData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
              fill="#8884d8"
            >
              {profitLossData.map((entry, index) => (
                <Cell key={`cell-pnl-${index}`} fill={profitLossColors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="middle"
              align="left"
              layout="vertical"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h2>Watchlist</h2>
    <ul>
      <li className="watchlist-item watchlist-header">
        <strong>Symbol</strong>
        <strong>Price</strong>
        <strong>Change</strong>
      </li>
      {watchlist.map((stock, index) => (
        <li key={index} className="watchlist-item">
          <span>{stock.name}</span>
          <span>{stock.price}</span>
          <span>{stock.change}</span>
        </li>
      ))}
    </ul>
    </aside>
  );
}
