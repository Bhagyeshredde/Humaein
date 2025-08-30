import React, { useEffect, useState } from "react";
import {
  getClaims,
  addClaim,
  updateClaim,
  deleteClaim,
  getPatients,
  getDoctors,
} from "../services/api";
import { predictClaimOutcome } from "../services/ai"; // ⬅️ updated import

function Claims() {
  const [claims, setClaims] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newClaim, setNewClaim] = useState({
    patientId: "",
    doctorId: "",
    amount: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const claimsData = await getClaims();
    const patientsData = await getPatients();
    const doctorsData = await getDoctors();

    // 🔮 Add AI predictions to each claim
    const claimsWithAI = claimsData.map((claim) => {
      const prediction = predictClaimOutcome(claim);
      return { ...claim, aiPrediction: prediction };
    });

    setClaims(claimsWithAI);
    setPatients(patientsData);
    setDoctors(doctorsData);
  };

  const handleAddClaim = async () => {
    const claim = {
      ...newClaim,
      createdAt: new Date().toISOString(),
    };
    await addClaim(claim);
    setNewClaim({ patientId: "", doctorId: "", amount: "", status: "Pending" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteClaim(id);
    fetchData();
  };

  const handleUpdateStatus = async (id, status) => {
    await updateClaim(id, { status });
    fetchData();
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const getDoctorName = (id) =>
    doctors.find((d) => d.id === id)?.name || "Unknown";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Claims</h1>

      {/* Add Claim Form */}
      <div className="flex gap-3 mb-6">
        <select
          value={newClaim.patientId}
          onChange={(e) => setNewClaim({ ...newClaim, patientId: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={newClaim.doctorId}
          onChange={(e) => setNewClaim({ ...newClaim, doctorId: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={newClaim.amount}
          onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
          className="border p-2"
        />

        <button
          onClick={handleAddClaim}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Claim
        </button>
      </div>

      {/* Claims Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Doctor</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">AI Prediction</th> {/* ⬅️ NEW */}
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.id} className="text-center">
              <td className="border p-2">{getPatientName(c.patientId)}</td>
              <td className="border p-2">{getDoctorName(c.doctorId)}</td>
              <td className="border p-2">${c.amount}</td>
              <td className="border p-2">
                <select
                  value={c.status}
                  onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                  className="border p-1"
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </td>
              <td className="border p-2 text-sm text-gray-700">
                {c.aiPrediction?.prediction || "Unknown"} <br />
                <span className="text-xs text-gray-500">
                  (Risk Score: {c.aiPrediction?.riskScore ?? "N/A"})
                </span>
              </td>
              <td className="border p-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Claims;
