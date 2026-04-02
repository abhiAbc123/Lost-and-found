
import React, { useEffect, useState } from "react";
import APIAdmin from "../apiAdmin";

function ManageItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", type: "", location: "" });

  const fetchItems = async () => {
    try {
      const res = await APIAdmin.get("/items");
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await APIAdmin.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({ name: item.name, type: item.type, location: item.location });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const res = await APIAdmin.put(`/items/${id}`, editData);
      setItems(items.map(item => (item._id === id ? res.data : item)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update item");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4">Manage Items</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        
         <tbody>
  {items.map((item, index) => (
    <tr key={item._id}>
      <td>{index + 1}</td>

      <td>
        {editingId === item._id ? (
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          item.name
        )}
      </td>

      <td>
        {editingId === item._id ? (
          <input
            type="text"
            name="type"
            value={editData.type}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          item.type
        )}
      </td>

      <td>
        {editingId === item._id ? (
          <input
            type="text"
            name="location"
            value={editData.location}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          item.location
        )}
      </td>

      <td>{item.user?.name || "Unknown"}</td>

      <td>
        {editingId === item._id ? (
          <>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => handleSave(item._id)}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}

export default ManageItems;
