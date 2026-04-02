/*
import React, { useEffect, useState } from "react";
import { getItemComments, addComment, deleteComment } from "../api";

function Comments({ itemId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments for this item
  const fetchComments = async () => {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getItemComments(itemId);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [itemId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await addComment(itemId, { text: newComment });
      setNewComment("");
      fetchComments();
        const audio = new Audio("/notification.mp3");
    audio.play();
    } catch (err) {
      console.error("Failed to add comment", err);
      setError("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setLoading(true);
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error("Failed to delete comment", err);
      setError("Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section mt-4">
      <h4>Comments</h4>

      <div className="mb-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="form-control mb-2"
        />
        <button className="btn btn-primary w-100" onClick={handleAddComment} disabled={loading}>
          {loading ? "Processing..." : "Add Comment"}
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {loading && !comments.length && <p>Loading comments...</p>}

      <ul className="list-group">
        {comments.map((c) => (
          <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{c.userId.name}:</strong> {c.text}
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(c._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {!loading && comments.length === 0 && <p>No comments yet.</p>}
    </div>
  );
}

export default Comments;
*/

import React, { useEffect, useState } from "react";
import { getItemComments, addComment, deleteComment } from "../api";
import { io } from "socket.io-client";

const socket = io("https://backend-project-w5p1.onrender.com", { withCredentials: true }); // use your deployed backend

function Comments({ itemId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const { data } = await getItemComments(itemId);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();

    socket.on("newComment", (data) => {
      if (data.itemId === itemId) {
        fetchComments();
        const audio = new Audio("/notification.mp3");
        audio.play();
      }
    });

    return () => socket.off("newComment");
  }, [itemId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(itemId, { text: newComment });
    setNewComment("");
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    fetchComments();
  };

  return (
    <div className="comments-section mt-4">
      <h4>Comments</h4>

      <div className="mb-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="form-control mb-2"
        />
        <button className="btn btn-primary w-100" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>

      <ul className="list-group">
        {comments.map((c) => (
          <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{c.userId?.name || "Unknown"}:</strong> {c.text}
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(c._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;
