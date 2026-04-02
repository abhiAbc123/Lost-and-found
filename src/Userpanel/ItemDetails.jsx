
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Comments from "../components/Comments";
import ShareButtons from "./ShareButtons";

function ItemDetails() {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [contact, setContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

 
  const fetchItem = async () => {
    try {
      const { data } = await API.get(`/items/${id}`);
      setItem(data);
    } catch (err) {
      console.error("Error fetching item:", err.response?.data || err.message);
    }
  };

  
  const handleContactOwner = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/items/contact/${id}`);
      setContact(data);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch contact info");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (!item) return <p className="text-center mt-5">Loading item details...</p>;

  return (
    <div className="col-md-6 mx-auto card p-4 shadow mt-5">
      <h3 className="mb-3">{item.name}</h3>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date:</strong> {item.date}</p>
      <p><strong>Description:</strong> {item.description}</p>

      <button
        className="btn btn-primary mt-3 w-100"
        onClick={handleContactOwner}
        disabled={loading}
      >
        {loading ? "Loading..." : "Contact Owner"}
      </button>

     
      {showModal && contact && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Owner Contact Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {contact.ownerName}</p>
                <p><strong>Phone:</strong> {contact.phone || "Not Provided"}</p>
                <p><strong>Email:</strong> {contact.email}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

     
      {item._id && <Comments itemId={item._id} />}
    

    </div>
    
  );
}

export default ItemDetails;
