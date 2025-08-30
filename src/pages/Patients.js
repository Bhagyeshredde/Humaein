import React, { useEffect, useState } from "react";
import { getPatients, addPatient, deletePatient, updatePatient } from "../services/api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "" });
  const [editingPatient, setEditingPatient] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [search, setSearch] = useState(""); // ✅ search state

  useEffect(() => {
    getPatients().then(setPatients).finally(() => setLoading(false));
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      showMessage("All fields are required!", "error");
      return;
    }
    try {
      const created = await addPatient(newPatient);
      setPatients([...patients, created]);
      setNewPatient({ name: "", age: "", gender: "" });
      showMessage("Patient added successfully!", "success");
    } catch {
      showMessage("Failed to add patient.", "error");
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await deletePatient(confirmDeleteId);
      setPatients(patients.filter((p) => p.id !== confirmDeleteId));
      showMessage("Patient deleted successfully!", "success");
    } catch {
      showMessage("Failed to delete patient.", "error");
    }
    setConfirmDeleteId(null);
  };

  const handleEditSave = async () => {
    try {
      const updated = await updatePatient(editingPatient.id, editingPatient);
      setPatients(patients.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPatient(null);
      showMessage("Patient updated successfully!", "success");
    } catch {
      showMessage("Failed to update patient.", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  // ✅ Filter patients by search
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Patients</h1>

      {/* ✅ Notification */}
      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            messageType === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add Patient Form */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2"
          placeholder="Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Age"
          type="number"
          value={newPatient.age}
          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
        />
        <select
          className="border p-2"
          value={newPatient.gender}
          onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button onClick={handleAdd} className="bg-green-600 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>

      {/* ✅ Search Box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Age</th>
            <th className="p-2">Gender</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="p-2">
                  {editingPatient?.id === patient.id ? (
                    <input
                      className="border p-1"
                      value={editingPatient.name}
                      onChange={(e) =>
                        setEditingPatient({ ...editingPatient, name: e.target.value })
                      }
                    />
                  ) : (
                    patient.name
                  )}
                </td>
                <td className="p-2">
                  {editingPatient?.id === patient.id ? (
                    <input
                      type="number"
                      className="border p-1"
                      value={editingPatient.age}
                      onChange={(e) =>
                        setEditingPatient({ ...editingPatient, age: e.target.value })
                      }
                    />
                  ) : (
                    patient.age
                  )}
                </td>
                <td className="p-2">
                  {editingPatient?.id === patient.id ? (
                    <select
                      className="border p-1"
                      value={editingPatient.gender}
                      onChange={(e) =>
                        setEditingPatient({ ...editingPatient, gender: e.target.value })
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    patient.gender
                  )}
                </td>
                <td className="p-2 flex gap-2">
                  {editingPatient?.id === patient.id ? (
                    <>
                      <button
                        onClick={handleEditSave}
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPatient(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingPatient(patient)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(patient.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No patients found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Popup */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 font-semibold">Are you sure you want to delete this patient?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;
