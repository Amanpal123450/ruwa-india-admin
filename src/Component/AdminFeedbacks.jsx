import { useEffect, useState } from "react";
import axios from "axios";

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ API se feedbacks fetch karna
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://ruwa-backend.onrender.com/api/feedback/admin/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve Feedback
  const approveFeedback = async (id) => {
    console.log(id)
    try {
      await axios.put(
        `https://ruwa-backend.onrender.com/api/feedback/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchFeedbacks(); // list refresh
    } catch (err) {
      console.error("Error approving feedback", err);
    }
  };

  // ✅ Delete Feedback
  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`https://ruwa-backend.onrender.com/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchFeedbacks(); // list refresh
    } catch (err) {
      console.error("Error deleting feedback", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Feedback Management</h2>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb._id} className="hover:bg-gray-50">
              <td className="p-2 border">{fb.name}</td>
              <td className="p-2 border">{fb.message}</td>
              <td className="p-2 border">{fb.rating} ⭐</td>
              <td className="p-2 border">
                {fb.approved ? "✅ Approved" : "⏳ Pending"}
              </td>
              <td className="p-2 border space-x-2">
                {!fb.approved && (
                  <button
                    onClick={() => approveFeedback(fb._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => deleteFeedback(fb._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {feedbacks.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-3">
                No feedbacks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminFeedbacks;
