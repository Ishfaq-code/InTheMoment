// src/components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#00887A] font-junge rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center ">{title}</h2>
        {/* Content (form goes here) */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
