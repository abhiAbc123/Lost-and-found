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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleGenerateDescription = async () => {
    if (loadingDesc) return;

    if (!name.trim() || !location.trim()) {
      return alert("Enter item name and location first!");
    }

    try {
      setLoadingDesc(true);
      const { data } = await generateDescription(name, location);
      if (data.description) {
        setSuggestions([data.description]);
        setDescription(data.description);
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

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      setErrorMessage("Enter valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

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

      try {
        const audio = new Audio("/notification.mp3");
        audio.play();
      } catch (e) {}

      navigate("/myposts");

    } catch (err) {
      if (!err.response) {
        setErrorMessage("Server not reachable. Try again later.");
      } 
      else if (err.response?.data?.message === "Fake Post Detected") {
        setErrorMessage(`🚫 AI Rejection: ${err.response.data.reason}`);
      } 
      else if (err.response?.status === 403) {
        setErrorMessage("⚠️ Unauthorized. Please log in again.");
      } 
      else {
        setErrorMessage(
          err.response?.data?.message || "Failed to post item"
        );
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-md-6 mx-auto card p-4 shadow mt-5">
      <h3 className="mb-4 text-center">Post Found Item</h3>

      {errorMessage && (
        <div className="alert alert-danger border-2 animate__animated animate__shakeX">
          <strong>Security Check:</strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Black Backpack"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location Found</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Metro Station Gate 2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>

          {suggestions.length > 0 && (
            <div className="mb-2">
              <small className="text-muted">Suggestion:</small>
              <div className="border p-2 rounded bg-light">
                {suggestions[0]}
              </div>
            </div>
          )}

          <div className="d-flex gap-2 mb-2">
            <textarea
              className="form-control"
              placeholder="Provide details about the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-info text-white"
              onClick={handleGenerateDescription}
              disabled={loadingDesc}
            >
              {loadingDesc ? "..." : "AI Suggest"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number (Optional)</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <small className="text-muted">
            AI will verify the photo against your details.
          </small>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="mt-2 rounded"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <button
          className="btn btn-success w-100 py-2 font-weight-bold"
          type="submit"
          disabled={isSubmitting || !name || !location || !description}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              AI Verifying Item...
            </>
          ) : (
            "Submit Found Post"
          )}
        </button>
      </form>
    </div>
  );
}

export default PostFound;