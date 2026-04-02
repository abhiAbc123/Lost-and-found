
import React, { useEffect, useState } from "react";
import API, { deleteUserItem, updateUserItem } from "../api";
import ShareButtons from "./ShareButtons";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const [editPost, setEditPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    description: "",
    image: "",
    imageFile: null
  });

 
  const [imgModal, setImgModal] = useState({ open: false, url: "" });


  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/items"); 
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteUserItem(id);
      setPosts(posts.filter((p) => p._id !== id));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  // Open edit modal
  const handleEdit = (post) => {
    setEditPost(post);
    setFormData({
      name: post.name,
      type: post.type,
      location: post.location,
      description: post.description || "",
      image: post.image || "",
      imageFile: null
    });
    setShowModal(true);
  };

 
  const submitEdit = async () => {
    try {
      const updatedData = { ...formData };

     
      if (formData.imageFile) {
        const form = new FormData();
        form.append("file", formData.imageFile);

        const uploadRes = await API.post("/upload", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        updatedData.image = uploadRes.data.url;
      }

      delete updatedData.imageFile; 

      const { data } = await updateUserItem(editPost._id, updatedData);
      setPosts(posts.map((p) => (p._id === editPost._id ? data : p)));
      setShowModal(false);
      alert("Post updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading posts...</p>;

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">My Posts</h3>
      <div className="row g-3">
        {posts.map((post) => (
          <div className="col-12 col-sm-6 col-md-3" key={post._id}>
            <div className="card h-100 d-flex flex-column p-3 shadow">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.name}
                  className="card-img-top"
                  style={{ maxHeight: "150px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setImgModal({ open: true, url: post.image })}
                />
              )}

              <h6 className="mt-2" style={{ fontSize: "0.9rem" }}>{post.name}</h6>
              <p style={{ fontSize: "0.75rem", margin: 0 }}>
                <strong>Type:</strong> {post.type}
              </p>
              <p style={{ fontSize: "0.75rem", margin: 0 }}>
                <strong>Location:</strong> {post.location}
              </p>
              <p style={{ fontSize: "0.7rem", margin: "0.25rem 0" }}>
                <strong>Date:</strong> {new Date(post.date).toLocaleString()}
              </p>

              <div className="d-flex gap-2 justify-content-center mt-auto">
                <button
                  className="btn btn-primary btn-sm flex-grow-1"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => window.location.href = `/item/${post._id}`}
                >
                  View Details
                </button>

                <button
                  className="btn btn-warning btn-sm flex-grow-1"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm flex-grow-1"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>

              <div className="mt-2 d-flex justify-content-center">
                <ShareButtons item={post} />
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center">No posts found.</p>}
      </div>

     
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
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

    </div>
  );
}

export default MyPosts;
