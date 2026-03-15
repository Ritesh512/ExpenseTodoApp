import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BirthdayTemplate = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: "template-1",
      message: "Wishing you a day filled with love and cheer!",
    },
    {
      id: "template-2",
      message: "May all your dreams come true on this special day!",
    },
    {
      id: "template-3",
      message: "Have a fantastic birthday celebration! 🎉",
    },
  ];

  const handleDownload = (type) => {
    const element = document.getElementById(selectedTemplate);

    html2canvas(element).then((canvas) => {
      if (type === "png") {
        const link = document.createElement("a");
        link.download = `${name || "birthday"}_card.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else {
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL(), "PNG", 0, 0, 210, 297);
        pdf.save(`${name || "birthday"}_card.pdf`);
      }

      setShowPopup(false);
    });
  };

  return (
    <div
      className="min-h-[70vh] p-4 md:p-6 flex flex-col gap-6"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      {/* TEMPLATE GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              setSelectedTemplate(template.id);
              setShowPopup(true);
            }}
            className="cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center text-center transition hover:scale-[1.03]"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              id={template.id}
              className="w-full flex flex-col items-center gap-3"
            >
              <img
                src="https://images.unsplash.com/photo-1513151233558-d860c5398176"
                alt="birthday"
                className="w-full h-32 object-cover rounded-lg"
              />

              <h3 className="text-lg font-semibold">
                {name ? `Happy Birthday, ${name}!` : "Your Special Day!"}
              </h3>

              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {template.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL */}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="w-full max-w-sm p-6 rounded-lg relative"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-3 top-3 text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Name
            </h3>

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm mb-4 outline-none"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleDownload("png")}
                className="px-4 py-2 rounded-md text-white text-sm font-semibold"
                style={{ background: "var(--color-brand-500)" }}
              >
                Download PNG
              </button>

              <button
                onClick={() => handleDownload("pdf")}
                className="px-4 py-2 rounded-md text-sm"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-main)",
                  color: "var(--text-primary)",
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayTemplate;
