import React, { useEffect, useState } from "react";
import api from "../services/api";

function ClaimsList() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get("/Claims");
        setClaims(response.data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) return <p>Loading claims...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Claims</h2>
      <ul className="space-y-2">
        {claims.map((claim) => (
          <li
            key={claim.id}
            className="p-3 bg-white rounded-xl shadow-md border"
          >
            <p><strong>ID:</strong> {claim.id}</p>
            <p><strong>Status:</strong> {claim.status}</p>
            <p><strong>Amount:</strong> {claim.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClaimsList;
