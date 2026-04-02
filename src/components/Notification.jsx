import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://backend-project-w5p1.onrender.com"); // your backend

function NotificationHandler() {
  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected to backend"));

    socket.on("newComment", (data) => {
      alert(data.message);
      const audio = new Audio("/notification.mp3");
      audio.play();
    });

    socket.on("deleteComment", (data) => {
      alert(data.message);
    });

    return () => socket.disconnect();
  }, []);

  return null;
}

export default NotificationHandler;
