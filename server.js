
const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

// Landing page
app.get("/", (req, res) => {
  res.send(`
    <h1>Containerization Demo</h1>
    <p>My Node.js application is running!</p>
    <p>Container: ${os.hostname()}</p>
    <a href="/healthz">Check Health</a>
    <br>
    <a href="/metadata">View Metadata</a>
  `);
});

// Health check endpoint
app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

// Runtime metadata endpoint
app.get("/metadata", (req, res) => {
  res.json({
    hostname: os.hostname(),
    uptime: process.uptime(),
    nodeVersion: process.version
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
