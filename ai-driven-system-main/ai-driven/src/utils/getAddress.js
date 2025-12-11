// utils/getAddress.js
export default async function getAddress(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.address;
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return {};
  }
}
