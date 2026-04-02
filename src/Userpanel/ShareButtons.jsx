import React, { useState } from "react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaEnvelope, FaShareAlt, FaTimes } from "react-icons/fa";

const ShareButtons = ({ item }) => {
  const [open, setOpen] = useState(false);

  if (!item) return null;

  const shareUrl = window.location.origin + "/item/" + item._id;
  const text = `Check out this ${item.type} item: ${item.name}`;
  const toggleShare = () => setOpen(!open);

  const shareOptions = [
    { icon: <FaWhatsapp />, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`, color: "text-success", name: "WhatsApp" },
    { icon: <FaFacebook />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: "text-primary", name: "Facebook" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/", color: "text-danger", name: "Instagram" },
    { icon: <FaEnvelope />, url: `mailto:?subject=${encodeURIComponent("Check this item!")}&body=${encodeURIComponent(text + " " + shareUrl)}`, color: "text-danger", name: "Gmail" },
  ];

  return (
    <div className="position-relative d-inline-block">
      
      <button
        className="btn  btn-sm d-flex text-white align-items-center gap-1"
        style={{ fontSize: "0.84rem", padding: "0.3rem 0.5rem",backgroundColor:"#bd6fb4" }}
        onClick={toggleShare}
      >
        <FaShareAlt /> Share
      </button>

      
      {open && (
        <div
          className="position-absolute bottom-100 start-50 translate-middle-x mb-2 bg-white shadow rounded-pill d-flex gap-2 align-items-center"
          style={{ zIndex: 10, padding: "0.5rem 0.75rem" }}
        >
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${opt.color} fs-5`}
              title={opt.name}
            >
              {opt.icon}
            </a>
          ))}

         
          <button
            onClick={() => setOpen(false)}
            className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
            style={{ padding: "0.2rem 0.4rem", borderRadius: "50%" }}
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
