const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Normal OK endpoint
app.get("/api/data", (req, res) => {
  res.json({
    message: "Everything is OK",
    time: new Date().toISOString()
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString()
  });
});

// Force 500 error
app.get("/api/error/500", (req, res) => {
  res.status(500).json({
    error: "Internal Server Error (simulated)"
  });
});

// Force 404 error
app.get("/api/error/404", (req, res) => {
  res.status(404).json({
    error: "Not Found (simulated)"
  });
});

// Random behavior
app.get("/api/random", (req, res) => {
  const rand = Math.random();

  if (rand < 0.7) {
    res.json({ message: "Random OK response" });
  } else if (rand < 0.85) {
    res.status(404).json({ error: "Random 404 error" });
  } else {
    res.status(500).json({ error: "Random 500 error" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`App running on port ${PORT}`);
});
