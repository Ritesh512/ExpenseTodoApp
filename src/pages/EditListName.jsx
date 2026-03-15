import { useEffect, useState } from "react";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";

const EditListName = () => {
  const [listNames, setListNames] = useState([]);
  const navigate = useNavigate();

  /* ================= FETCH LISTS ================= */

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch(
          "https://expense-todo-five.vercel.app/api/users/todo/lists",
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const isAuthValid = await checkAuth(response);
        if (!isAuthValid) {
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!data?.lists) return;

        const formatted = data.lists.map((list) => ({
          label: list.listName,
          value: list._id,
        }));

        setListNames(formatted);
      } catch (err) {
        toast.error("Failed to load lists");
      }
    };

    fetchLists();
  }, []);

  /* ================= DELETE LIST ================= */

  const handleDelete = async (listId) => {
    try {
      const response = await fetch(
        `https://expense-todo-five.vercel.app/api/users/todo/lists/${listId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete list");
      }

      setListNames((prev) => prev.filter((list) => list.value !== listId));

      toast.success("List deleted successfully");
    } catch (err) {
      toast.error("Error deleting list");
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-6 md:px-6 space-y-6"
      style={{ background: "var(--bg-main)" }}
    >
      {/* HEADER */}

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md border"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <FaArrowLeft />
        </button>

        <h1
          className="text-xl md:text-2xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Edit List Names
        </h1>
      </div>

      {/* LIST CONTAINER */}

      <div
        className="max-w-lg mx-auto rounded-xl border p-4 md:p-6 space-y-3"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        {listNames.length > 0 ? (
          listNames.map((list) => (
            <div
              key={list.value}
              className="flex items-center justify-between px-4 py-3 rounded-lg border"
              style={{ borderColor: "var(--border-color)" }}
            >
              <span
                className="text-sm md:text-base font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {list.label}
              </span>

              <button
                onClick={() => handleDelete(list.value)}
                className="p-2 rounded-md transition hover:opacity-80"
                style={{ color: "#ef4444" }}
              >
                <FaTrashAlt />
              </button>
            </div>
          ))
        ) : (
          <p
            className="text-center py-8"
            style={{ color: "var(--text-secondary)" }}
          >
            No Lists Added Yet
          </p>
        )}
      </div>
    </div>
  );
};

export default EditListName;
