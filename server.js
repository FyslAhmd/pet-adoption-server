import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

await connectDB();

//routes
app.use("/users", userRoutes);
app.use("/pets", petRoutes);
app.use("/submissions", submissionRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Pet Adoption Backend is Running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
