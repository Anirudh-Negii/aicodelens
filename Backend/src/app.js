const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Testing the server");
});

app.use("/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

module.exports = app;
