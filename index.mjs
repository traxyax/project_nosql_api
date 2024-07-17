import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import orders from "./routes/orders.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load the /orders routes
app.use("/orders", orders);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});