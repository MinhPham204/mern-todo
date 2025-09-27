import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import todoRouter from "./routes/todo.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// 🔹 Root & health (để khỏi “Cannot GET /”)
app.all("/", (_req, res) => res.status(200).send("Todo API is running. See /health or /api/todos"));
app.get("/health", (_req, res) => res.status(200).send("ok"));

// 🔹 API chính
app.use("/api/todos", todoRouter);

// ❗️ KHÔNG đặt notFound/errorHandler TRƯỚC các route trên
// Nếu bạn có notFound/errorHandler, đặt SAU cùng:
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 🔹 BẮT BUỘC: lắng nghe trên 0.0.0.0 và PORT của Render
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server on :${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });
