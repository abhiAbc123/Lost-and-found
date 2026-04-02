


import React, { useEffect, useState } from "react";
import APIAdmin from "../apiAdmin";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Type</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item,idx) => (
            <tr key={item._idx}>
              <td>{idx+1}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.user?.name || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
