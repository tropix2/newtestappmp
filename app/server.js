const express = require("express");
const path = require("path");
const client = require("prom-client");

const app = express();
const PORT = 3000;

/**
 * Prometheus metrics
 */
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "app_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

const httpRequestDuration = new client.Histogram({
  name: "app_http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route"],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2]
});

const inFlightRequests = new client.Gauge({
  name: "app_http_in_flight_requests",
  help: "In-flight HTTP requests"
});

/**
 * Middleware for metrics
 */
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.path
  });

  inFlightRequests.inc();

  res.on("finish", () => {
    end();
    inFlightRequests.dec();

    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
  });

  next();
});

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.get("/api/data", (req, res) => {
  res.json({ message: "Everything is OK" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/error/500", (req, res) => {
  res.status(500).json({ error: "Internal Server Error (simulated)" });
});

app.get("/api/error/404", (req, res) => {
  res.status(404).json({ error: "Not Found (simulated)" });
});

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

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`App running on port ${PORT}`);
});
