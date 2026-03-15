import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { HiOutlinePlus, HiOutlinePencil } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TodoItemComponent from "./TodoItem";
import checkAuth from "../api/checkauth";

const animatedComponents = makeAnimated();

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
  const [listId, setListId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [userTodo, setUserTodo] = useState([]);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  /* ================= FETCH LISTS ================= */

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch(
          "https://expense-todo-five.vercel.app/api/users/todo/lists",
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

        const data = await res.json();

        if (!data?.lists) return;

        const options = data.lists.map((list) => ({
          label: list.listName,
          value: list._id,
        }));

        setUserList(options);
      } catch (err) {
        toast.error("Failed to load lists");
      }
    };

    fetchLists();
  }, []);

  /* ================= FETCH TASKS ================= */

  const handleChange = async (selected) => {
    if (!selected) return;

    setListId(selected.value);
    setUserTodo([]); // clear old tasks

    try {
      const res = await fetch(
        `https://expense-todo-five.vercel.app/api/users/todo/lists/getList/${selected.value}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      setUserTodo(data.tasks || []);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  /* ================= ADD LIST ================= */

  const addNewList = async () => {
    if (!listName.trim()) return toast.warning("Enter list name");

    try {
      const res = await fetch(
        "https://expense-todo-five.vercel.app/api/users/todo/lists/addList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ listName }),
        },
      );

      const result = await res.json();

      // handle duplicate list error
      if (!res.ok || !result?.list) {
        toast.error(result.message || "Unable to create list");
        return;
      }

      const newOption = {
        label: result.list.listName,
        value: result.list._id,
      };

      setUserList((prev) => [...prev, newOption]);

      toast.success("List created");

      setListName("");
      setModal(false);
    } catch (err) {
      toast.error("Server error while creating list");
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className="min-h-screen p-4 md:p-6 space-y-6"
      style={{ background: "var(--bg-main)" }}
    >
      {/* TOP BAR */}

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

        <div className="w-full md:w-[260px]">
          <Select
            options={userList}
            components={animatedComponents}
            onChange={handleChange}
            placeholder="Select list..."
            styles={selectStyles}
          />
        </div>
      </div>

      {/* TASK AREA */}
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
            setUserTodo={setUserTodo}
          />
        ) : (
          <p style={{ color: "var(--text-secondary)" }}>
            Select a list to start tracking tasks
          </p>
        )}
      </div>

      {/* CREATE LIST MODAL */}

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
            <button
              onClick={() => setModal(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Create List
            </h2>

            <input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List name..."
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{
                background: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />

            <button
              onClick={addNewList}
              className="mt-4 w-full py-2 rounded-md text-sm font-medium bg-indigo-500 text-white"
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
