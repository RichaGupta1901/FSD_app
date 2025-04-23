const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
// axios.defaults.withCredentials = true;

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;
const FINNHUB_API_KEY = "cvqvb19r01qp88cnqdk0cvqvb19r01qp88cnqdkg";
const TWELVE_API_KEY = "ca46560c6790481ea4ddcab08d9bf13c";

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Stock Data Server is running.");
});

// 🟦 Historical Data - Twelve Data REST API
app.get("/api/historical", async (req, res) => {
  const symbol = req.query.symbol || "AAPL";
  console.log(`📥 [REST] Request for historical data: ${symbol}`);

  try {
    const response = await axios.get("https://api.twelvedata.com/time_series", {
      params: {
        symbol,
        interval: "1h",
        outputsize: 24,
        apikey: TWELVE_API_KEY
      }
    });

    const chartData = response.data.values.reverse().map(item => ({
      time: item.datetime.slice(11, 16),
      price: parseFloat(item.close)
    }));

    console.log(`✅ [REST] Fetched ${chartData.length} historical data points for ${symbol}`);
    res.json(chartData);
  } catch (err) {
    console.error(`❌ [REST] Error fetching Twelve Data for ${symbol}:`, err.message);
    res.status(500).json([]);
  }
});

// ✅ Fetch Indian & US Stock Symbols
app.get("/api/symbols", async (req, res) => {
  try {
    // US stocks from Finnhub
    const usRes = await axios.get("https://finnhub.io/api/v1/stock/symbol", {
      params: { exchange: "US", token: FINNHUB_API_KEY },
    });

    // Indian stocks from Twelve Data
    const indiaRes = await axios.get("https://api.twelvedata.com/stocks", {
      params: { exchange: "NSE", apikey: TWELVE_API_KEY },
    });

    const usSymbols = usRes.data.slice(0, 30).map((s) => ({
      symbol: s.symbol,
      exchange: "NASDAQ",
    }));

    const indiaSymbols = (indiaRes.data?.data || []).slice(0, 30).map((s) => ({
      symbol: s.symbol,
      exchange: "NSE",
    }));

    res.json([...usSymbols, ...indiaSymbols]);
  } catch (err) {
    console.error("❌ Error fetching symbols:", err.message);
    res.status(500).json([]);
  }
});


// 🟩 Real-time WebSocket using Finnhub
io.on("connection", (socket) => {
  console.log("🔌 [Socket] Client connected");

  let symbol = "AAPL";
  let history = [];

  socket.on("subscribe", async (newSymbol) => {
    symbol = newSymbol;
    history = [];
    console.log(`📡 [Socket] Client subscribed to: ${symbol}`);
    socket.emit("stockUpdate", history);
  });

  const interval = setInterval(async () => {
    try {
      console.log(`⏱️ [Live] Fetching price for ${symbol}...`);
      const response = await axios.get("https://finnhub.io/api/v1/quote", {
        params: {
          symbol,
          token: FINNHUB_API_KEY
        }
      });

      const now = new Date();
      const point = {
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: response.data.c
      };

      history.push(point);
      if (history.length > 50) history = history.slice(-50);

      console.log(`📈 [Live] ${symbol} @ ${point.time} → $${point.price}`);
      socket.emit("stockUpdate", [point]);
    } catch (err) {
      console.error(`❌ [Live] Finnhub error for ${symbol}:`, err.message);
    }
  }, 300000); // every 5 minutes

  socket.on("disconnect", () => {
    console.log("❌ [Socket] Client disconnected");
    clearInterval(interval);
  });
});


server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
