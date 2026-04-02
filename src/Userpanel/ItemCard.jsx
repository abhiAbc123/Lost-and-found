/*
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MapModal from "../components/MapModal";
import ShareButtons from "./ShareButtons";

function ItemCard({ item }) {
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState(null);
  const [imgModal, setImgModal] = useState({ open: false, url: "" });

  const handleViewMap = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.location)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
        setShowMap(true);
      } else {
        alert("Could not find location coordinates.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching location.");
    }
  };

  return (
    <>
      <div
        className="card shadow-sm h-100"
        style={{ maxWidth: "180px", margin: "0.1rem", maxHeight: "290px", cursor: "pointer" }}
      >
        {item.image && (
          <div style={{ height: "150px", overflow: "hidden" }}>
            <img
              src={item.image}
              className="card-img-top"
              alt={item.name}
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              onClick={() => setImgModal({ open: true, url: item.image })}
            />
          </div>
        )}

        <div className="card-body d-flex flex-column p-2">
          <h6 className="card-title fw-bold mb-1" style={{ fontSize: "0.85rem" }}>
            {item.name}
          </h6>
          <p className="card-text flex-grow-1 mb-1" style={{ fontSize: "0.75rem" }}>
            <strong>Type:</strong> {item.type} <br />
            <strong>Location:</strong> {item.location} <br />
            <small className="text-muted">{new Date(item.date).toLocaleString()}</small>
          </p>

          <div className="d-flex gap-1 mt-auto">
            <Link
              to={`/item/${item._id}`}
              className="btn btn-primary btn-sm flex-grow-1"
              style={{ fontSize: "0.7rem", padding: "0.25rem 0.4rem" }}
            >
              View Details
            </Link>

            <button
              className="btn btn-success btn-sm flex-grow-1"
              style={{ fontSize: "0.7rem", padding: "0.25rem 0.4rem" }}
              onClick={handleViewMap}
            >
            View Map
            </button>
          </div>

          <div className="mt-2 d-flex justify-content-center">
            <ShareButtons item={item} />
          </div>
        </div>
      </div>

     {imgModal.open && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    onClick={() => setImgModal({ open: false, url: "" })} 
  >
    <div
      className="modal-dialog modal-dialog-centered"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="modal-content bg-transparent border-0 position-relative">
      
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          onClick={() => setImgModal({ open: false, url: "" })}
        />
        <img
          src={imgModal.url}
          alt="Full"
          className="img-fluid rounded"
          style={{ maxHeight: "80vh", width: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  </div>
)}

     
      {coords && (
        <MapModal
          show={showMap}
          onClose={() => setShowMap(false)}
          latitude={coords.lat}
          longitude={coords.lng}
          name={item.name}
          location={item.location}
        />
      )}
    </>
  );
}

export default ItemCard;
*/



import React, { useState } from "react";
import { Link } from "react-router-dom";
import MapModal from "../components/MapModal";
import ShareButtons from "./ShareButtons";
import { BadgeCheck } from "lucide-react"; // Optional: Use Lucide for a nice icon

function ItemCard({ item }) {
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState(null);
  const [imgModal, setImgModal] = useState({ open: false, url: "" });

  const handleViewMap = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.location)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
        setShowMap(true);
      } else {
        alert("Could not find location coordinates.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching location.");
    }
  };

  return (
    <>
      <div
        className="card shadow-sm h-100 position-relative"
        style={{ maxWidth: "180px", margin: "0.1rem", maxHeight: "310px", cursor: "pointer" }}
      >
        {/* ✅ AI VERIFIED BADGE */}
        {item.isAiVerified && (
          <div 
            className="position-absolute top-0 start-0 m-1 px-2 py-1 bg-white rounded-pill shadow-sm d-flex align-items-center"
            style={{ zIndex: 10, border: "1px solid #28a745" }}
            title="Verified by AI"
          >
            <BadgeCheck size={12} color="#28a745" className="me-1" />
            <span style={{ fontSize: "0.6rem", fontWeight: "bold", color: "#28a745" }}>VERIFIED</span>
          </div>
        )}

        {item.image && (
          <div style={{ height: "140px", overflow: "hidden" }}>
            <img
              src={item.image}
              className="card-img-top"
              alt={item.name}
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              onClick={() => setImgModal({ open: true, url: item.image })}
            />
          </div>
        )}

        <div className="card-body d-flex flex-column p-2">
          <h6 className="card-title fw-bold mb-1" style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.name}
          </h6>
          <p className="card-text flex-grow-1 mb-1" style={{ fontSize: "0.75rem" }}>
            <span className={`badge ${item.type === 'Lost' ? 'bg-danger' : 'bg-success'} mb-1`} style={{ fontSize: "0.6rem" }}>
              {item.type}
            </span> <br />
            <strong>At:</strong> {item.location} <br />
            <small className="text-muted" style={{ fontSize: "0.65rem" }}>
              {new Date(item.date).toLocaleDateString()}
            </small>
          </p>

          <div className="d-flex flex-column gap-1 mt-auto">
            <Link
              to={`/item/${item._id}`}
              className="btn btn-outline-primary btn-sm"
              style={{ fontSize: "0.7rem", padding: "0.2rem" }}
            >
              Details
            </Link>

            <button
              className="btn btn-success btn-sm"
              style={{ fontSize: "0.7rem", padding: "0.2rem" }}
              onClick={handleViewMap}
            >
              Map
            </button>
          </div>

          <div className="mt-2 d-flex justify-content-center">
            <ShareButtons item={item} />
          </div>
        </div>
      </div>

      {/* --- Image Zoom Modal --- */}
      {imgModal.open && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
          onClick={() => setImgModal({ open: false, url: "" })} 
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0">
              <img
                src={imgModal.url}
                alt="Full View"
                className="img-fluid rounded"
                style={{ maxHeight: "85vh", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Map Modal --- */}
      {coords && (
        <MapModal
          show={showMap}
          onClose={() => setShowMap(false)}
          latitude={coords.lat}
          longitude={coords.lng}
          name={item.name}
          location={item.location}
        />
      )}
    </>
  );
}

export default ItemCard;