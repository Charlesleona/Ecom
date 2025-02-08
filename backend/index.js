import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/user.js";
const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/", userRoutes);

app.get("/", (req, res) => {
  res.send("<h1>working</h1>");
});

app.listen(port, () => {
  connectDB();
  console.log(`Server running in ${port}`);
});
