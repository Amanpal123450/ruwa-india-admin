// import axios from "axios";
// import { useEffect, useState } from "react";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// function EmployeeMap({ location, isLoaded }) {
//   if (!isLoaded) return <p>Loading map...</p>;

//   return (
//     <GoogleMap
//       center={{ lat: location.lat, lng: location.lng }}
//       zoom={15}
//       mapContainerStyle={{ width: "200px", height: "150px" }}
//     >
//       <Marker position={{ lat: location.lat, lng: location.lng }} />
//     </GoogleMap>
//   );
// }

// export default function AdminUsersList() {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//     const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyB29kosx7Ws9J3lWMjahStEibH3Ik5cTCA", // your API key
//   });

//   // Mock data for demonstration since we can't use localStorage or make API calls
//   const mockEmployees = [
//     {
//       employeeId: "EMP001",
//       name: "John Doe",
//       isOnline: true,
//       lastSeen: new Date().toISOString()
//     },
//     {
//       employeeId: "EMP002",
//       name: "Jane Smith",
//       isOnline: false,
//       lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
//     },
//     {
//       employeeId: "EMP003",
//       name: "Mike Johnson",
//       isOnline: true,
//       lastSeen: new Date().toISOString()
//     },
//     {
//       employeeId: "EMP004",
//       name: "Sarah Wilson",
//       isOnline: false,
//       lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
//     }
//   ];

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // In a real implementation, you would use:
//         const token = localStorage.getItem("token") || "your-jwt-token";
//         const res = await axios.get("https://ruwa-backend.onrender.com/api/location/employees", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//        setEmployees(
//   res.data.map(emp => ({
//     ...emp,
//     currentLocation: emp.currentLocation
//       ? {
//           lat: Number(emp.currentLocation.lat),
//           lng: Number(emp.currentLocation.lng),
//         }
//       : null,
//   }))
// );

//         console.log("Employees data loaded:", res.data);

//         // For demo purposes, simulate API call
//         // await new Promise(resolve => setTimeout(resolve, 9000));
//         // setEmployees(employees);
//         // console.log("Employees data loaded:", mockEmployees);

//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         setError("Failed to fetch employee data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//     const interval = setInterval(fetchEmployees, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <div className="admin-users-container">
//         <div className="loading">Loading employees...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="admin-users-container">
//         <div className="error">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="admin-users-container">
//         <h2>Employees Status</h2>
//         <div className="table-container">
//           <table className="employees-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Employee ID</th>
//                 <th>Status</th>
//                 <th>Last Seen</th>
//                 <th>Location</th>
//               </tr>
//             </thead>
//            <tbody>
//   {employees.map((emp) => (
//     <tr key={emp.employeeId} className={emp.isOnline ? "online" : "offline"}>
//       <td className="name-cell">{emp.name}</td>
//       <td className="id-cell">{emp.employeeId}</td>
//       <td className="status-cell">
//         <span className={`status-badge ${emp.isOnline ? 'online-badge' : 'offline-badge'}`}>
//           {emp.isOnline ? "Online" : "Offline"}
//         </span>
//       </td>
//       <td className="time-cell">
//         {emp.isOnline
//           ? "Currently Online"
//           : emp.locationUpdatedAt
//           ? new Date(emp.locationUpdatedAt).toLocaleString()
//           : "Never Active"}
//       </td>
//       <td className="location-cell">
//                   {emp.currentLocation ? <EmployeeMap location={emp.currentLocation} isLoaded={isLoaded} /> : "No Location"}
//                 </td>
//     </tr>
//   ))}
// </tbody>

//           </table>
//         </div>
//       </div>

// <style jsx>{`
//   .admin-users-container {
//     padding: 20px;
//     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//     background-color: #f8f9fa;
//     min-height: 100vh;
//   }
//   .admin-users-container h2 {
//     text-align: center;
//     margin-bottom: 30px;
//     color: #343a40;
//     font-size: 2rem;
//     font-weight: 600;
//   }
//   .table-container {
//     overflow-x: auto;
//     border-radius: 8px;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }
//   .employees-table {
//     width: 100%;
//     border-collapse: collapse;
//     background-color: #fff;
//     border-radius: 8px;
//     overflow: hidden;
//   }
//   .employees-table th,
//   .employees-table td {
//     padding: 15px;
//     text-align: left;
//     border-bottom: 1px solid #e9ecef;
//   }
//   .employees-table th {
//     background-color: #007bff;
//     color: #fff;
//     font-weight: 600;
//     text-transform: uppercase;
//     font-size: 0.85rem;
//     letter-spacing: 0.5px;
//   }
//   .employees-table tbody tr {
//     transition: all 0.2s ease;
//   }
//   .employees-table tbody tr:nth-child(even) {
//     background-color: #f8f9fa;
//   }
//   .employees-table tbody tr.online {
//     border-left: 4px solid #28a745;
//   }
//   .employees-table tbody tr.offline {
//     border-left: 4px solid #dc3545;
//   }
//   .employees-table tbody tr:hover {
//     background-color: #e3f2fd;
//     transform: translateY(-1px);
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   }
//   .name-cell {
//     font-weight: 600;
//     color: #343a40;
//   }
//   .id-cell {
//     font-family: monospace;
//     color: #6c757d;
//     font-size: 0.9rem;
//   }
//   .status-badge {
//     padding: 4px 12px;
//     border-radius: 20px;
//     font-size: 0.8rem;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//   }
//   .online-badge {
//     background-color: #d4edda;
//     color: #155724;
//     border: 1px solid #c3e6cb;
//   }
//   .offline-badge {
//     background-color: #f8d7da;
//     color: #721c24;
//     border: 1px solid #f1c2c7;
//   }
//   .time-cell {
//     color: #6c757d;
//     font-size: 0.9rem;
//   }
//   .loading,
//   .error {
//     text-align: center;
//     padding: 40px;
//     font-size: 1.2rem;
//     color: #6c757d;
//   }
//   .error {
//     color: #dc3545;
//     background-color: #f8d7da;
//     border: 1px solid #f1c2c7;
//     border-radius: 4px;
//     margin: 20px auto;
//     max-width: 500px;
//   }
//   @media (max-width: 768px) {
//     .admin-users-container {
//       padding: 10px;
//     }
//     .employees-table th,
//     .employees-table td {
//       padding: 10px 8px;
//       font-size: 0.9rem;
//     }
//     .admin-users-container h2 {
//       font-size: 1.5rem;
//       margin-bottom: 20px;
//     }
//   }
// `}</style>
//     </>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

// Fix default marker icons issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function EmployeeMap({ location }) {
  if (!location) return <span>No Location</span>;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      style={{ width: "200px", height: "100px" }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]}>
        <Popup>Employee Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default function AdminUsersList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10; // ek page pe 10 employees

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token") || "your-jwt-token";
        const res = await axios.get(
          "https://ruwa-backend.onrender.com/api/location/employees",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEmployees(
          res.data.map((emp) => ({
            ...emp,
            currentLocation: emp.currentLocation
              ? {
                  lat: Number(emp.currentLocation.lat),
                  lng: Number(emp.currentLocation.lng),
                }
              : null,
          }))
        );

        console.log("Employees data loaded:", res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    const interval = setInterval(fetchEmployees, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  // Sorting employees (online pehle)
  const sortedEmployees = [...employees].sort((a, b) => {
    if (a.isOnline === b.isOnline) return 0;
    return a.isOnline ? -1 : 1;
  });

  // Pagination logic
  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);

  return (
    <>
      <div className="admin-users-container">
        <h2>Employees Status</h2>
        <div className="table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr
                  key={emp.employeeId}
                  className={emp.isOnline ? "online" : "offline"}
                >
                  <td className="name-cell">{emp.name}</td>
                  <td className="id-cell">{emp.employeeId}</td>
                  <td className="status-cell">
                    <span
                      className={`status-badge ${
                        emp.isOnline ? "online-badge" : "offline-badge"
                      }`}
                    >
                      {emp.isOnline ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="time-cell">
                    {emp.isOnline
                      ? "Currently Online"
                      : emp.lastSeen
                      ? new Date(emp.lastSeen).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never Active"}
                  </td>
                  <td className="location-cell">
                    <EmployeeMap location={emp.currentLocation} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <style jsx>{`
        .admin-users-container {
          padding: 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        .admin-users-container h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #343a40;
          font-size: 2rem;
          font-weight: 600;
        }
        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .employees-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .employees-table th,
        .employees-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        .employees-table th {
          background-color: #007bff;
          color: #fff;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }
        .employees-table tbody tr {
          transition: all 0.2s ease;
        }
        .employees-table tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .employees-table tbody tr.online {
          border-left: 4px solid #28a745;
        }
        .employees-table tbody tr.offline {
          border-left: 4px solid #dc3545;
        }
        .employees-table tbody tr:hover {
          background-color: #e3f2fd;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .name-cell {
          font-weight: 600;
          color: #343a40;
        }
        .id-cell {
          font-family: monospace;
          color: #6c757d;
          font-size: 0.9rem;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .online-badge {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .offline-badge {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f1c2c7;
        }
        .time-cell {
          color: #6c757d;
          font-size: 0.9rem;
        }
        .loading,
        .error {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #6c757d;
        }
        .error {
          color: #dc3545;
          background-color: #f8d7da;
          border: 1px solid #f1c2c7;
          border-radius: 4px;
          margin: 20px auto;
          max-width: 500px;
        }
        @media (max-width: 768px) {
          .admin-users-container {
            padding: 10px;
          }
          .employees-table th,
          .employees-table td {
            padding: 10px 8px;
            font-size: 0.9rem;
          }
          .admin-users-container h2 {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }
        }
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .pagination button {
          padding: 6px 12px;
          border: 1px solid #007bff;
          border-radius: 4px;
          background: white;
          color: #007bff;
          cursor: pointer;
        }
        .pagination button.active {
          background: #007bff;
          color: white;
        }
        .pagination button:disabled {
          background: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
