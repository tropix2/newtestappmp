const express = require("express");
const path = require("path");
const client = require("prom-client");

const app = express();
const PORT = 3000;

/* ============================
   Prometheus setup
============================ */
client.collectDefaultMetrics();

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

/* ============================
   Metrics middleware (CRITICAL)
============================ */
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  inFlightRequests.inc();

  res.on("finish", () => {
    const duration =
      Number(process.hrtime.bigint() - start) / 1e9;

    const rawRoute =
      (req.route && req.route.path) ||
      req.baseUrl ||
      (req.path && req.path.split("?")[0]) ||
      "unmatched";

    const route =
      !req.route && res.statusCode === 404
        ? "unmatched_404"
        : rawRoute;

    httpRequestDuration
      .labels(req.method, route)
      .observe(duration);

    httpRequestsTotal
      .labels(req.method, route, String(res.statusCode))
      .inc();

    inFlightRequests.dec();
  });

  next();
});

/* ============================
   Static frontend
============================ */
app.use(express.static(path.join(__dirname, "public")));

/* ============================
   API routes (REAL HTTP)
============================ */
app.get("/api/ok", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.get("/api/error/500", (req, res) => {
  res.status(500).json({ error: "Internal Server Error (simulated)" });
});

app.get("/api/error/404", (req, res) => {
  res.status(404).json({ error: "Not Found (simulated)" });
});

app.get("/api/work", async (req, res) => {
  const delay = Math.min(Number(req.query.ms) || 100, 2000);
  await new Promise((r) => setTimeout(r, delay));
  res.json({ message: `Worked ${delay}ms` });
});

/* ============================
   Health & Metrics
============================ */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

/* ============================
   404 handler (IMPORTANT)
============================ */
app.use((req, res) => {
  res.status(404).send("Not Found");
});

/* ============================
   Start server
============================ */
app.listen(PORT, () => {
  console.log(`Observability app listening on port ${PORT}`);
});
