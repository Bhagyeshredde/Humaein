import axios from "axios";

// === Base APIs ===
const PATIENTS_API = "https://68b17c21a860fe41fd5e9481.mockapi.io/Patients";
const CLAIMS_API = "https://68b17c21a860fe41fd5e9481.mockapi.io/Claims";
const DOCTORS_API = "https://68b19c01a860fe41fd5f029a.mockapi.io/Doctors";

// === Patients API ===
export const getPatients = async () => {
  const res = await axios.get(PATIENTS_API);
  return res.data;
};

export const addPatient = async (patient) => {
  const res = await axios.post(PATIENTS_API, patient);
  return res.data;
};

export const updatePatient = async (id, patient) => {
  const res = await axios.put(`${PATIENTS_API}/${id}`, patient);
  return res.data;
};

export const deletePatient = async (id) => {
  await axios.delete(`${PATIENTS_API}/${id}`);
};

// === Doctors API ===
export const getDoctors = async () => {
  const res = await axios.get(DOCTORS_API);
  return res.data;
};

export const addDoctor = async (doctor) => {
  const res = await axios.post(DOCTORS_API, doctor);
  return res.data;
};

export const updateDoctor = async (id, doctor) => {
  const res = await axios.put(`${DOCTORS_API}/${id}`, doctor);
  return res.data;
};

export const deleteDoctor = async (id) => {
  await axios.delete(`${DOCTORS_API}/${id}`);
};

// === Claims API ===
export const getClaims = async () => {
  const res = await axios.get(CLAIMS_API);
  return res.data;
};

export const addClaim = async (claim) => {
  const res = await axios.post(CLAIMS_API, claim);
  return res.data;
};

export const updateClaim = async (id, claim) => {
  const res = await axios.put(`${CLAIMS_API}/${id}`, claim);
  return res.data;
};

export const deleteClaim = async (id) => {
  await axios.delete(`${CLAIMS_API}/${id}`);
};
