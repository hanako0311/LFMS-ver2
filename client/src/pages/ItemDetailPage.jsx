import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then(setItem)
      .catch(console.error);
  }, [id]);

  const handleClaim = () => {
    const claimantName = prompt("Please enter your name to claim this item:");
    if (claimantName) {
      fetch(`/api/items/claim/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claimantName }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          navigate("/dashboard?tab=found-items");
        })
        .catch((error) => {
          console.error("Failed to claim item:", error);
          alert("Failed to claim item");
        });
    }
  };

  if (!item)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  const nextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % item.imageUrls.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prevIndex) =>
        (prevIndex + item.imageUrls.length - 1) % item.imageUrls.length
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row max-w-4xl mx-auto my-8">
      <div className="flex-1">
        {item.imageUrls && item.imageUrls.length > 0 && (
          <>
            <img
              src={item.imageUrls[activeImageIndex]}
              alt={item.item}
              className="rounded-lg w-full object-contain max-h-80"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "default-image.png";
              }}
            />
            {item.imageUrls.length > 1 && (
              <div className="flex justify-center space-x-4 mt-2">
                <button onClick={prevImage}>&lt;</button>
                <button onClick={nextImage}>&gt;</button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex-2 ml-4">
        <h1 className="text-2xl font-bold">{item.item}</h1>
        <p className="text-gray-700 mt-2">{item.description}</p>
        <p className="text-gray-600 mt-1">Category: {item.category}</p>
        <p className="text-gray-600 mt-1">
          Date Found/Lost: {new Date(item.dateFound).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mt-1">Found at: {item.location}</p>
        {item.status === "Open" ? (
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClaim}
          >
            Claim This Item
          </button>
        ) : (
          <p className="mt-4 text-red-500">
            Claimed by: {item.claimantName || "Unavailable"}
          </p>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
