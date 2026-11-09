import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import checkAuth from "../api/checkauth";

const frequencyLabels = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  once: "Regular",
};

const TodoReminderMonitor = () => {
  const navigate = useNavigate();
  const hasShownError = useRef(false);

  useEffect(() => {
    let active = true;

    const checkReminders = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/users/todo/lists/reminders/claim",
          {
            method: "POST",
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
        if (!res.ok) throw new Error("Unable to check todo reminders");

        const data = await res.json();
        hasShownError.current = false;
        if (!active) return;

        (data.reminders || []).forEach((reminder) => {
          const itemLabel = reminder.pendingCount === 1 ? "item" : "items";
          const frequency = frequencyLabels[reminder.frequency] || "Todo";
          const body = `Please complete your ${frequency} tasks: ${reminder.pendingCount} ${itemLabel} remaining.`;

          if ("Notification" in window && Notification.permission === "granted") {
            try {
              const notification = new Notification(reminder.listName, { body });
              notification.onclick = () => window.focus();
              return;
            } catch {
              toast.info(`${reminder.listName}: ${body}`, { autoClose: 10000 });
              return;
            }
          }

          if (active) {
            toast.info(`${reminder.listName}: ${body}`, { autoClose: 10000 });
          }
        });
      } catch (error) {
        if (!active || hasShownError.current) return;
        hasShownError.current = true;
        toast.error(error.message || "Failed to check todo reminders");
      }
    };

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 60_000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [navigate]);

  return null;
};

export default TodoReminderMonitor;
