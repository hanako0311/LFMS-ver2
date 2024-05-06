import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/items/history") // Adjust the endpoint as necessary
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data.items); // Assuming the data is returned as an array of items
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch history:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="history-container">
      <h1>Claimed Items History</h1>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item._id} className="history-item">
              <h3>
                {item.item} - {item.category}
              </h3>
              <p>Claimed by: {item.claimantName}</p>
              <p>
                Date Claimed: {new Date(item.dateClaimed).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No history found.</p>
      )}
    </div>
  );
}

export default History;
