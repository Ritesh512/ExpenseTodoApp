import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { HiOutlinePlus, HiOutlinePencil } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TodoItemComponent from "./TodoItem";
import checkAuth from "../api/checkauth";

const animatedComponents = makeAnimated();
const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "once", label: "Regular (does not reset)" },
];

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--bg-surface)",
    borderColor: "var(--border-color)",
    color: "var(--text-primary)",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--bg-surface)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--bg-main)" : "var(--bg-surface)",
    color: "var(--text-primary)",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--text-primary)",
  }),
};

const Todo = () => {
  const [listName, setListName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [listId, setListId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [userTodo, setUserTodo] = useState([]);
  const [modal, setModal] = useState(false);
  const refreshErrorShown = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/todo/lists", {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        });

        const isAuthValid = await checkAuth(res);
        if (!isAuthValid) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load lists");

        const data = await res.json();
        setUserList(
          (data.lists || []).map((list) => ({
            label: list.listName,
            value: list._id,
            frequency: list.frequency || "once",
          })),
        );
      } catch {
        toast.error("Failed to load lists");
      }
    };

    fetchLists();
  }, [navigate]);

  useEffect(() => {
    if (!listId) return undefined;
    let active = true;

    const refreshTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/todo/lists/getList/${listId}`,
          {
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
        if (!res.ok) throw new Error("Unable to refresh todo tasks");

        const data = await res.json();
        if (!active) return;
        setUserTodo(
          (data.tasks || []).sort(
            (a, b) => Number(a.completed) - Number(b.completed),
          ),
        );
        refreshErrorShown.current = false;
      } catch {
        if (active && !refreshErrorShown.current) {
          refreshErrorShown.current = true;
          toast.error("Unable to refresh todo tasks");
        }
      }
    };

    const intervalId = window.setInterval(refreshTasks, 60_000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [listId, navigate]);

  const handleChange = async (selected) => {
    if (!selected) return;

    setListId(selected.value);
    setFrequency(selected.frequency);
    setUserTodo([]);

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/todo/lists/getList/${selected.value}`,
        {
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
      if (!res.ok) throw new Error("Failed to load tasks");

      const data = await res.json();
      const tasks = data.tasks || [];
      setUserTodo(tasks.sort((a, b) => Number(a.completed) - Number(b.completed)));
      setFrequency(data.frequency || selected.frequency);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const addNewList = async () => {
    if (!listName.trim()) return toast.warning("Enter list name");

    if (reminderEnabled) {
      try {
        if ("Notification" in window && Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            toast.info("Reminder will appear in the app while it is open");
          }
        }
      } catch {
        toast.info("Reminder will appear in the app while it is open");
      }
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/users/todo/lists/addList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            listName,
            frequency,
            reminderEnabled,
            reminderTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          }),
        },
      );

      const result = await res.json();
      if (!res.ok || !result?.list) {
        toast.error(result.message || "Unable to create list");
        return;
      }

      const option = {
        label: result.list.listName,
        value: result.list._id,
        frequency: result.list.frequency,
      };
      setUserList((previous) => [...previous, option]);
      setListId(option.value);
      setUserTodo([]);
      toast.success("List created");
      setListName("");
      setFrequency("daily");
      setReminderEnabled(false);
      setReminderTime("09:00");
      setModal(false);
    } catch {
      toast.error("Server error while creating list");
    }
  };

  const selectedList = userList.find((list) => list.value === listId) || null;

  return (
    <div
      className="min-h-screen p-4 md:p-6 space-y-6"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <HiOutlinePlus size={18} />
            Add List
          </button>

          <button
            onClick={() => navigate("/todo/edit-list-name")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <HiOutlinePencil size={18} />
            Edit
          </button>
        </div>

        <div className="w-full md:w-[280px]">
          <Select
            options={userList}
            value={selectedList}
            components={animatedComponents}
            onChange={handleChange}
            placeholder="Select list..."
            styles={selectStyles}
          />
        </div>
      </div>

      <div
        className="rounded-xl border p-4 md:p-6"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        {listId ? (
          <TodoItemComponent
            userTodo={userTodo}
            listId={listId}
            frequency={selectedList?.frequency || frequency}
            setUserTodo={setUserTodo}
          />
        ) : (
          <p style={{ color: "var(--text-secondary)" }}>
            Select a list to start tracking tasks
          </p>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setModal(false)}
        >
          <div
            className="w-full max-w-[420px] p-6 rounded-xl border relative max-h-[90vh] overflow-y-auto"
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
            >
              ✕
            </button>

            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Create List
            </h2>

            <label
              className="text-sm block mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              List name
            </label>
            <input
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="e.g. Revision"
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
              Repeat tasks
            </label>
            <select
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className="w-full px-3 py-2 rounded-md border text-sm mb-4"
              style={{
                background: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label
              className="flex items-center gap-2 text-sm mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(event) => setReminderEnabled(event.target.checked)}
              />
              Remind me about this list
            </label>

            {reminderEnabled && (
              <>
                <label
                  className="text-sm block mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Reminder time (local)
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(event) => setReminderTime(event.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-sm"
                  style={{
                    background: "var(--bg-main)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Tasks reset daily, on Sunday, on the first of each month, or
                  on January 1 for daily, weekly, monthly, and yearly lists.
                  Reminders are daily, Sunday, every Sunday, or the first of
                  each month respectively. Regular lists do not reset and
                  remind once on their creation day. The app must be open.
                </p>
              </>
            )}

            <button
              onClick={addNewList}
              className="mt-5 w-full py-2 rounded-md text-sm font-medium bg-indigo-500 text-white"
            >
              Create List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
