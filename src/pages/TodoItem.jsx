import { useState } from "react";
import { HiOutlineClock, HiOutlinePlus } from "react-icons/hi2";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";
import { useNavigate } from "react-router-dom";

const TodoItemComponent = ({ userTodo, listId, setUserTodo }) => {
  const [modal, setModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [reminder, setReminder] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createTask = async () => {
    if (loading) return;

    if (!taskName || !duration) {
      return toast.warning("Task name and duration required");
    }

    try {
      setLoading(true);

      const payload = {
        taskName,
        duration,
        reminder: reminder || null,
      };

      const res = await fetch(
        `https://expense-todo-five.vercel.app/api/users/todo/lists/addTask/${listId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const isAuthValid = await checkAuth(res);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      setUserTodo((prev) => [...prev, data.task]);

      toast.success("Task added successfully");

      setModal(false);
      setTaskName("");
      setDuration("");
      setReminder("");
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(
        `https://expense-todo-five.vercel.app/api/users/todo/lists/${listId}/task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const isAuthValid = await checkAuth(res);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setUserTodo((prev) => prev.filter((todo) => todo._id !== taskId));

      toast.success("Task completed 🎉");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="space-y-3">
      {/* TASK LIST */}

      {userTodo.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>No tasks yet</p>
      )}

      {userTodo.map((todo) => (
        <div
          key={todo._id}
          className="flex items-center justify-between p-3 rounded-lg border"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              onChange={() => deleteTask(todo._id)}
              className="w-4 h-4 cursor-pointer"
            />

            <span style={{ color: "var(--text-primary)" }}>
              {todo.taskName}
            </span>
          </div>

          <div
            className="flex items-center gap-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <HiOutlineClock size={16} />
            {new Date(todo.duration).toLocaleDateString()}
          </div>
        </div>
      ))}

      {/* ADD TASK BUTTON */}

      <button
        onClick={() => setModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        <HiOutlinePlus size={18} />
        Add New Task
      </button>

      {/* ADD TASK MODAL */}

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setModal(false)}
        >
          <div
            className="w-[90%] md:w-[420px] p-6 rounded-xl border relative"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setModal(false)}
              className="absolute top-3 right-3 text-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              ✕
            </button>

            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Add New Task
            </h2>

            {/* TASK NAME */}

            <div className="mb-4">
              <label
                className="text-sm block mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Task Name
              </label>

              <input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task..."
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{
                  background: "var(--bg-main)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* DURATION */}

            <div className="mb-4">
              <label
                className="text-sm block mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Duration
              </label>

              <input
                type="datetime-local"
                value={duration}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => {
                  setDuration(e.target.value);
                  e.target.blur();
                }}
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{
                  background: "var(--bg-main)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* REMINDER */}

            <div className="mb-4">
              <label
                className="text-sm block mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Reminder (optional)
              </label>

              <input
                type="datetime-local"
                value={reminder}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => {
                  setReminder(e.target.value);
                  e.target.blur();
                }}
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{
                  background: "var(--bg-main)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* SAVE BUTTON */}

            <button
              onClick={createTask}
              disabled={loading}
              className="w-full py-2 rounded-md text-sm font-medium"
              style={{
                background: loading ? "#9ca3af" : "#6366f1",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItemComponent;
