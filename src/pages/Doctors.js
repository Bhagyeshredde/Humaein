import React, { useEffect, useState } from "react";
import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
  });
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newDoctor.name || !newDoctor.specialty) return;
    const created = await addDoctor(newDoctor);
    setDoctors([...doctors, created]);
    setNewDoctor({ name: "", specialty: "", email: "", phone: "" });
  };

  const handleDelete = async (id) => {
    await deleteDoctor(id);
    setDoctors(doctors.filter((d) => d.id !== id));
  };

  const handleEditSave = async () => {
    const updated = await updateDoctor(editingDoctor.id, editingDoctor);
    setDoctors(doctors.map((d) => (d.id === updated.id ? updated : d)));
    setEditingDoctor(null);
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Doctors</h1>

      {/* Add Doctor Form */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2"
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, name: e.target.value })
          }
        />
        <input
          className="border p-2"
          placeholder="Specialty"
          value={newDoctor.specialty}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, specialty: e.target.value })
          }
        />
        <input
          className="border p-2"
          placeholder="Email"
          type="email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, email: e.target.value })
          }
        />
        <input
          className="border p-2"
          placeholder="Phone"
          type="text"
          value={newDoctor.phone}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone: e.target.value })
          }
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          className="border p-2 w-1/3"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Doctors Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Specialty</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doctor) => (
            <tr key={doctor.id} className="border-t">
              <td className="p-2">
                {editingDoctor?.id === doctor.id ? (
                  <input
                    className="border p-1"
                    value={editingDoctor.name}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  doctor.name
                )}
              </td>
              <td className="p-2">
                {editingDoctor?.id === doctor.id ? (
                  <input
                    className="border p-1"
                    value={editingDoctor.specialty}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        specialty: e.target.value,
                      })
                    }
                  />
                ) : (
                  doctor.specialty
                )}
              </td>
              <td className="p-2">
                {editingDoctor?.id === doctor.id ? (
                  <input
                    className="border p-1"
                    value={editingDoctor.email}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  doctor.email
                )}
              </td>
              <td className="p-2">
                {editingDoctor?.id === doctor.id ? (
                  <input
                    className="border p-1"
                    value={editingDoctor.phone}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  doctor.phone
                )}
              </td>
              <td className="p-2 flex gap-2">
                {editingDoctor?.id === doctor.id ? (
                  <>
                    <button
                      onClick={handleEditSave}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDoctor(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingDoctor(doctor)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Doctors;
