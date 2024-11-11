import express from "express";
import mysql from "mysql2";
import dbconfig from "./config/db.js";
import "dotenv/config";
import { LogError } from "./utils/consoles.js";
import authRouters from "./routes/authRoutes.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); 
const PORT = process.env.DB_PORT || 4000;

// database connection ------>

dbconfig.connect((err) => {
  if (err) {
    LogError(
      "/src/index.ts",
      "DATABASE CONNECTION",
      "DATABASE CONNECTION",
      err
    );
  } else {
    app.listen(PORT, () => {
      console.log(`🚀 Connected to the PostgreSQL DB`);
      console.log(`🚀 app is listening on port ${PORT}`);
    });
    app.use("/auth", authRouters);
  }
});
