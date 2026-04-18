const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/bloodDB");

app.use("/donor", require("./routes/donor"));

app.get("/predict", (req, res) => {
  res.json({ result: "Eligible to donate ✅" });
});

app.listen(5000, () => console.log("Server running on port 5000"));