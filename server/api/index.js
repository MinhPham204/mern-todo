import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js"; // đường dẫn của bạn
import todoRouter from "../src/routes/todo.routes.js"

dotenv.config();
await connectDB();

const app = express();

// CORS: whitelist domain client (Vercel) & local
const allowed = [
  "http://localhost:5173",
  "https://mern-todo-gilt-two.vercel.app"
];
app.use(cors({ origin: allowed, credentials: true }));

app.use(express.json());

// route kiểm tra nhanh
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// các routes chính
app.use("/api/todos", todoRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
