import { Router } from "express";
import {
  createTodo, listTodos, getTodo, updateTodo, deleteTodo, stats
} from "../controllers/todo.controller.js";

const r = Router();

r.get("/", listTodos);
r.post("/", createTodo);
r.get("/stats", stats);
r.get("/:id", getTodo);
r.put("/:id", updateTodo);
r.delete("/:id", deleteTodo);

export default r;
