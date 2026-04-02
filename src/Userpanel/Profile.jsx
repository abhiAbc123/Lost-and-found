
import React, { useEffect, useState } from "react";
import API from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false); 
  const [formData, setFormData] = useState({ name: "", email: "" });

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser(data);
      setFormData({ name: data.name, email: data.email });
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
      alert("Failed to load profile. Please login again.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { data } = await API.put("/auth/me", formData); 
      setUser(data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="col-md-5 mx-auto card p-4 shadow mt-5">
      <h3 className="mb-4 text-center">User Profile</h3>

      {editing ? (
        <>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success w-100" onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary w-100 mt-2"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button className="btn btn-warning mt-3 w-100" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;
