

import React, { useEffect, useState } from "react";
import APIAdmin from "../apiAdmin";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const fetchUsers = async () => {
    try {
      const res = await APIAdmin.get("/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await APIAdmin.delete(`/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditData({ name: user.name, email: user.email });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const res = await APIAdmin.put(`/users/${id}`, editData);
      setUsers(users.map(u => (u._id === id ? res.data : u)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4">Manage Users</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
  {users.map((user, index) => (
    <tr key={user._id}>
      <td>{index + 1}</td>
      <td>
        {editingId === user._id ? (
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          user.name
        )}
      </td>
      <td>
        {editingId === user._id ? (
          <input
            type="email"
            name="email"
            value={editData.email}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          user.email
        )}
      </td>
      <td>
        {editingId === user._id ? (
          <>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => handleSave(user._id)}
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
              onClick={() => handleDelete(user._id)}
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

export default ManageUsers;
