/*
import React, { useState } from "react";
import API, { generateDescription } from "../api";
import { useNavigate } from "react-router-dom";

function PostFound() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleGenerateDescription = async () => {
    if (!name.trim() || !location.trim()) {
      return alert("Enter item name and location first!");
    }

    try {
      setLoadingDesc(true);
      const { data } = await generateDescription(name, location);

      if (data.description) {
        setSuggestions([data.description]);
        setDescription(data.description);
      } else {
        setSuggestions([]);
        setDescription("");
        alert("No suggestions generated");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    } finally {
      setLoadingDesc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("type", "Found");
      formData.append("date", new Date().toISOString());
      formData.append("phone", phone);
      if (image) formData.append("image", image);

      await API.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item posted successfully!");
      const audio = new Audio("/notification.mp3");
      audio.play();
      navigate("/myposts");

    } catch (err) {
      if (err.response?.status === 403) {
        setErrorMessage(
          "⚠️ AI blocked this post. It may contain spam, fake reward, or suspicious content."
        );
      } else {
        setErrorMessage(
          err.response?.data?.message || "Failed to post item"
        );
      }
    }
  };

  return (
    <div className="col-md-6 mx-auto card p-4 shadow mt-5">
      <h3 className="mb-4 text-center">Post Found Item</h3>

      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Item Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Location Found</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <div className="d-flex gap-2 mb-2">
            <textarea
              className="form-control"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-info"
              onClick={handleGenerateDescription}
              disabled={loadingDesc}
            >
              {loadingDesc ? "Generating..." : "AI Suggest"}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setDescription(s)}
                >
                  Suggestion {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label>Phone Number (Optional)</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PostFound;
*/



import React, { useState } from "react";
import API, { generateDescription } from "../api";
import { useNavigate } from "react-router-dom";

function PostFound() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // ---------------- AI DESCRIPTION ----------------
  const handleGenerateDescription = async () => {
    if (!name.trim() || !location.trim()) {
      return alert("Enter item name and location first!");
    }

    try {
      setLoadingDesc(true);
      const { data } = await generateDescription(name, location);

      if (data.description) {
        setSuggestions([data.description]);
        setDescription(data.description);
      } else {
        setSuggestions([]);
        setDescription("");
        alert("No suggestions generated");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    } finally {
      setLoadingDesc(false);
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 🔒 Frontend validation
    if (!image) {
      return setErrorMessage("Image is required!");
    }

    if (description.trim().length < 10) {
      return setErrorMessage("Description too short!");
    }

    if (location.trim().length < 3) {
      return setErrorMessage("Enter valid location!");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("type", "Found");
      formData.append("date", new Date().toISOString());
      formData.append("phone", phone);
      formData.append("image", image);

      await API.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item posted successfully!");
      navigate("/myposts");

    } catch (err) {
      if (err.response?.data?.message === "Fake post detected") {
        setErrorMessage("🚫 Fake post detected! Please enter proper details.");
      } else {
        setErrorMessage(
          err.response?.data?.message || "Failed to post item"
        );
      }
    }
  };

  return (
    <div className="col-md-6 mx-auto card p-4 shadow mt-5">
      <h3 className="mb-4 text-center">Post Found Item</h3>

      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ITEM NAME */}
        <div className="mb-3">
          <label>Item Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* LOCATION */}
        <div className="mb-3">
          <label>Location Found</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label>Description</label>

          <div className="d-flex gap-2 mb-2">
            <textarea
              className="form-control"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button
              type="button"
              className="btn btn-info"
              onClick={handleGenerateDescription}
              disabled={loadingDesc}
            >
              {loadingDesc ? "Generating..." : "AI Suggest"}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setDescription(s)}
                >
                  Suggestion {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-3">
          <label>Phone Number (Optional)</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* IMAGE */}
        <div className="mb-3">
          <label>Upload Image (Required)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        {/* SUBMIT */}
        <button className="btn btn-success w-100" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PostFound;