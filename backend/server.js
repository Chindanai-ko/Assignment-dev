import express from "express";
import dotenv from "dotenv";

import ownerRoutes from "./routes/owner.route.js";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());

app.use("/api/owners", ownerRoutes);

app.listen(port, () => {
    connectDB();
    console.log("Server is running on http://localhost:" + port);
});