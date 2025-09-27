import Todo from "../models/todo.model.js";

// Create
export const createTodo = async (req, res) => {
  const { title, dueAt } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: "title is required" });
  const todo = await Todo.create({ title: title.trim(), dueAt: dueAt || null });
  return res.status(201).json(todo);
};

// List + filters + pagination
export const listTodos = async (req, res) => {
  const { page = 1, limit = 10, status, from, to } = req.query;

  const q = {};
  if (status === "true") q.completed = true;
  if (status === "false") q.completed = false;

  // filter theo createdAt (PDF gợi ý), có thể mở rộng dueAt
  if (from || to) {
    q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Todo.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Todo.countDocuments(q)
  ]);
  return res.json({
    items,
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / Number(limit))
  });
};

// Get one
export const getTodo = async (req, res) => {
  const doc = await Todo.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json(doc);
};

// Update
export const updateTodo = async (req, res) => {
  const { title, completed, dueAt } = req.body;
  const doc = await Todo.findByIdAndUpdate(
    req.params.id,
    { title, completed, dueAt },
    { new: true, runValidators: true }
  );
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json(doc);
};

// Delete
export const deleteTodo = async (req, res) => {
  const doc = await Todo.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ ok: true });
};

// Stats (aggregation)
export const stats = async (_req, res) => {
  const agg = await Todo.aggregate([
    { $group: { _id: "$completed", count: { $sum: 1 } } }
  ]);
  const done = agg.find(a => a._id === true)?.count || 0;
  const notDone = agg.find(a => a._id === false)?.count || 0;
  res.json({ done, notDone });
};
