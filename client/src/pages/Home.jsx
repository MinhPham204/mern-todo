import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home() {
  const [form, setForm] = useState({ title: "", dueAt: "" });
  const [edit, setEdit] = useState(null); // todo đang edit
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [query, setQuery] = useState({ status: "all", page: 1, limit: 5, from: "", to: "" });
  const [stats, setStats] = useState({ done: 0, notDone: 0 });

  const fetchList = async () => {
    const params = { page: query.page, limit: query.limit };
    if (query.status !== "all") params.status = query.status;
    if (query.from) params.from = query.from;
    if (query.to) params.to = query.to;

    const res = await api.get("/todos", { params });
    setData(res.data);
  };

  const fetchStats = async () => {
    const res = await api.get("/todos/stats");
    setStats(res.data);
  };

  useEffect(() => {
    fetchList();
    fetchStats();
  }, [query.page, query.status, query.limit, query.from, query.to]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post("/todos", form);
    setForm({ title: "", dueAt: "" });
    setQuery({ ...query, page: 1 });
    fetchStats();
  };

  const onToggle = async (id, completed) => {
    await api.put(`/todos/${id}`, { completed: !completed });
    fetchList();
    fetchStats();
  };

  const onDelete = async (id) => {
    await api.delete(`/todos/${id}`);
    fetchList();
    fetchStats();
  };

  const onEditSave = async (e) => {
    e.preventDefault();
    await api.put(`/todos/${edit._id}`, {
      title: edit.title,
      dueAt: edit.dueAt,
      completed: edit.completed,
    });
    setEdit(null);
    fetchList();
    fetchStats();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-black/10">
      <h1 className="text-2xl font-semibold">Todo List</h1>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="px-4 py-2 border rounded bg-green-100">
           Completed: {stats.done}
        </div>
        <div className="px-4 py-2 border rounded bg-yellow-100">
           Active: {stats.notDone}
        </div>
      </div>

      {/* Form create */}
      <form onSubmit={onCreate} className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1 rounded"
          placeholder="New task..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={form.dueAt}
          onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
        />
        <button className="px-4 py-2 rounded bg-black">Add</button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <label>Status:</label>
        <select
          className="border px-2 py-1 rounded"
          value={query.status}
          onChange={(e) => setQuery({ ...query, status: e.target.value, page: 1 })}
        >
          <option value="all">All</option>
          <option value="false">Active</option>
          <option value="true">Completed</option>
        </select>

        <label>From:</label>
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={query.from}
          onChange={(e) => setQuery({ ...query, from: e.target.value, page: 1 })}
        />
        <label>To:</label>
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={query.to}
          onChange={(e) => setQuery({ ...query, to: e.target.value, page: 1 })}
        />
      </div>

      {/* List */}
      <ul className="space-y-2">
        {data.items.map((t) => (
          <li key={t._id} className="border rounded p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => onToggle(t._id, t.completed)}
              />
              <div>
                <span className={t.completed ? "line-through opacity-60" : ""}>
                  {t.title}
                </span>
                {t.dueAt && (
                  <div className="text-sm text-gray-500">
                    Due: {new Date(t.dueAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEdit(t)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(t._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex gap-2">
        <button
          className="border px-3 py-1 rounded"
          disabled={data.page <= 1}
          onClick={() => setQuery({ ...query, page: data.page - 1 })}
        >
          Prev
        </button>
        <span>Page {data.page} / {data.pages}</span>
        <button
          className="border px-3 py-1 rounded"
          disabled={data.page >= data.pages}
          onClick={() => setQuery({ ...query, page: data.page + 1 })}
        >
          Next
        </button>
      </div>

      {/* Modal edit */}
      {edit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={onEditSave}
            className="bg-white p-6 rounded shadow-lg space-y-4 w-96"
          >
            <h2 className="text-lg font-semibold">Edit Todo</h2>
            <input
              className="border px-3 py-2 w-full rounded"
              value={edit.title}
              onChange={(e) => setEdit({ ...edit, title: e.target.value })}
            />
            <input
              type="date"
              className="border px-3 py-2 w-full rounded"
              value={edit.dueAt ? edit.dueAt.substring(0, 10) : ""}
              onChange={(e) => setEdit({ ...edit, dueAt: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={edit.completed}
                onChange={(e) => setEdit({ ...edit, completed: e.target.checked })}
              />
              <label>Completed</label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
