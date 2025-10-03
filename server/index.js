import express from "express";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import router from "./routes/index.js";

const app = express();

// CORS with allowlist from environment
const allowedOriginsEnv = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// Form parser
app.use(express.json());

// Routes setup
app.use("/", router);

// Error middleware
app.use(errorMiddleware);

// Server listens on specified PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is up and listening on PORT: ${PORT || 8000}.`);
});
