import React, { useState } from "react";
import axios from "axios";

export default function CreateVendor() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    aadhar: "",
    email: "",
    address: "",
    areaName: "",
    gstNumber: "",
    vendorId: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null)

    try {
      const token = localStorage.getItem("token"); // Admin JWT
      const res = await axios.post(
        "https://ruwa-backend.onrender.com/api/admin/createVendor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text: res.data.message,
      });

      // reset form
      setFormData({
        name: "",
        phone: "",
        password: "",
        aadhar: "",
        email: "",
        address: "",
        areaName: "",
        gstNumber: "",
        vendorId: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to create vendor. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        🏪 Create Vendor Account
      </h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="vendorId"
          placeholder="Vendor ID (e.g. VEND@2001)"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.vendorId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Vendor Name"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="aadhar"
          placeholder="Aadhar Number"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.aadhar}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="areaName"
          placeholder="Area name"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.areaName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="gstNumber"
          placeholder="GST Number (optional)"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.gstNumber}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Full Address"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          rows="3"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
        >
          {loading ? "Creating Vendor..." : "Create Vendor"}
        </button>
      </form>
    </div>
  );
}
