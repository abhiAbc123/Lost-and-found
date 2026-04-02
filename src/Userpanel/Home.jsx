
import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import { getAllItems } from "../api";
import { motion } from "framer-motion";
import ChatBot from "./ChatBot";
function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data } = await getAllItems();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = (deletedId) => {
    setItems(items.filter((item) => item._id !== deletedId));
  };

  if (loading) {
    return <p className="text-center py-5">Loading items...</p>;
  }

  return (
    <div className="container py-5" style={{ minHeight: "90vh" }}>
      
      
      <section className="mb-5 p-5 rounded-4 shadow-lg text-center"
               style={{
                 background: "linear-gradient(135deg, #06beb6, #48b1bf)",
                 color: "#fff",
                 position: "relative",
                 overflow: "hidden",
               }}
      >
        <motion.h1
          className="display-3 fw-bold mb-3"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}
        >
          Our Vision
        </motion.h1>
        <motion.p
          className="lead mx-auto"
          style={{ maxWidth: "700px", fontSize: "1.25rem", lineHeight: "1.8", textShadow: "1px 1px 4px rgba(0,0,0,0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Building a connected community where lost & found items are reunited seamlessly. 
          Our mission is to create trust, efficiency, and care in every recovery.
        </motion.p>

       
        <div style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%",
          animation: "pulse 8s infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-50px",
          right: "-50px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          animation: "pulse 10s infinite"
        }} />

        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(0.8); opacity: 0.5; }
              50% { transform: scale(1.2); opacity: 0.2; }
              100% { transform: scale(0.8); opacity: 0.5; }
            }
          `}
        </style>
      </section>

     
      <h2
        className="text-center mb-5 fw-bold"
        style={{
          background: "linear-gradient(90deg, #06beb6, #48b1bf)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        Recent Lost & Found Items
      </h2>

      <div className="row">
        {items.length === 0 ? (
          <p className="text-center">No items found.</p>
        ) : (
          items.map((item) => (
            <motion.div
              key={item._id}
              className="col-md-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ItemCard item={item} onDelete={handleDelete} />
            </motion.div>
          ))
        )}
      </div>
        <ChatBot />
    </div>
  );
}

export default Home;
