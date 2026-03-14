import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Birthday = () => {
  const [name, setName] = useState("");
  const cardRef = useRef();

  const handleDownload = (format) => {
    const element = cardRef.current;

    html2canvas(element).then((canvas) => {
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${name || "birthday"}_card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 15, 15, 180, 140);
        pdf.save(`${name || "birthday"}_card.pdf`);
      }
    });
  };

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 py-6"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      {/* NAME INPUT */}

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full max-w-xs px-4 py-2 rounded-md text-sm outline-none"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
        }}
      />

      {/* BIRTHDAY CARD */}

      <div
        ref={cardRef}
        className="w-full max-w-md p-6 rounded-xl text-center"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          🎉 Happy Birthday {name || "Friend"}!
        </h1>

        <h3
          className="text-sm md:text-base mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Wishing You the Best 🎂
        </h3>

        <p className="text-sm md:text-base leading-relaxed">
          May your day be filled with love, laughter, and everything you've
          wished for. Have an amazing year ahead!
        </p>
      </div>

      {/* DOWNLOAD BUTTONS */}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleDownload("png")}
          className="px-4 py-2 rounded-md text-sm font-semibold text-white"
          style={{ background: "var(--color-brand-500)" }}
        >
          Download PNG
        </button>

        <button
          onClick={() => handleDownload("pdf")}
          className="px-4 py-2 rounded-md text-sm font-semibold"
          style={{
            border: "1px solid var(--border-color)",
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Birthday;
