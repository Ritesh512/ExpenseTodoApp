import { useState } from "react";
import { HiOutlineClock, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";
import { useNavigate } from "react-router-dom";

const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

const TodoItemComponent = ({ userTodo, listId, frequency, setUserTodo }) => {
  const [modal, setModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createTask = async () => {
    if (loading) return;
    if (!taskName.trim()) return toast.warning("Enter a task name");

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/api/users/todo/lists/addTask/${listId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ taskName, duration: duration || null }),
        },
      );

      const isAuthValid = await checkAuth(res);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create task");

      setUserTodo((previous) => sortTasks([...previous, data.task]));
      toast.success("Task added successfully");
      setModal(false);
      setTaskName("");
      setDuration("");
    } catch (error) {
      toast.error(error.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/todo/lists/${listId}/task/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ completed: !task.completed }),
        },
      );

      const isAuthValid = await checkAuth(res);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update task");

      setUserTodo((previous) =>
        sortTasks(previous.map((item) => item._id === task._id ? data.task : item)),
      );
    } catch (error) {
      toast.error(error.message || "Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/todo/lists/${listId}/task/${taskId}`,
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

      if (!res.ok) throw new Error("Failed to delete task");
      setUserTodo((previous) => previous.filter((todo) => todo._id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete task");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2
          className="font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {frequency === "once"
            ? "Regular list"
            : `${frequency.charAt(0).toUpperCase()}${frequency.slice(1)} Tasks`}
        </h2>
        <span
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {userTodo.filter((task) => !task.completed).length} remaining
        </span>
      </div>

      {userTodo.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>No tasks yet</p>
      )}

      {userTodo.map((todo) => (
        <div
          key={todo._id}
          className="todo-row-card flex items-center justify-between gap-3 p-3 rounded-lg border"
        >
          <label className="flex min-w-0 items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(todo.completed)}
              onChange={() => toggleTask(todo)}
              className="w-4 h-4 shrink-0 cursor-pointer"
              aria-label={`Mark ${todo.taskName} ${todo.completed ? "incomplete" : "complete"}`}
            />

            <span
              className={`break-words ${todo.completed ? "line-through opacity-60" : ""}`}
              style={{ color: "var(--text-primary)" }}
            >
              {todo.taskName}
            </span>
          </label>

          <div className="flex shrink-0 items-center gap-2">
            {todo.duration && (
              <div
                className="flex items-center gap-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <HiOutlineClock size={16} />
                {new Date(todo.duration).toLocaleDateString()}
              </div>
            )}
            <button
              type="button"
              onClick={() => deleteTask(todo._id)}
              className="px-2 py-1 text-sm rounded border"
              style={{
                color: "#ef4444",
                borderColor: "var(--border-color)",
              }}
              aria-label={`Delete ${todo.taskName}`}
              title="Delete task"
            >
              <HiOutlineTrash size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}

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

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setModal(false)}
        >
          <div
            className="w-full max-w-[420px] p-6 rounded-xl border relative"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setModal(false)}
              className="absolute top-3 right-3 text-xl"
              aria-label="Close"
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

            <label
              className="text-sm block mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Task name
            </label>
            <input
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="Enter task..."
              className="w-full px-3 py-2 rounded-md border text-sm mb-4"
              style={{
                background: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />

            <label
              className="text-sm block mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Due date (optional)
            </label>
            <input
              type="datetime-local"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                background: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />

            <button
              onClick={createTask}
              disabled={loading}
              className="mt-5 w-full py-2 rounded-md text-sm font-medium"
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

TodoItemComponent.propTypes = {
  userTodo: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      taskName: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      duration: PropTypes.string,
    }),
  ).isRequired,
  listId: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  setUserTodo: PropTypes.func.isRequired,
};

export default TodoItemComponent;
