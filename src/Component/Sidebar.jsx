import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaPhone,
  FaHome,
  FaUsers,
  FaCapsules,
  FaAmbulance,
  FaShieldAlt,
  FaCreditCard,
  FaUserTie,
  FaUser,
  FaPlus,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const Sidebar = ({ onLogout }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      onLogout();
    }
  };

  return (
    <div className="custom-sidebar">
      <div className="sidebar-header mb-4">
        <h5>Ruwa India</h5>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Main</p>
        <Link to="/Home" className="sidebar-link">
          <span className="sidebar-icon">
            <FaChartBar />
          </span>
          Dashboard
        </Link>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Page Components</p>

       

       
       
        <Link to="/Contact_leads" className="sidebar-link">
          <span className="sidebar-icon">
             <FaPhone />
          </span>
           Contact Leads
        </Link>

        <Link to="/kendra-leads" className="sidebar-link">
          <span className="sidebar-icon">
            <FaHome />
          </span>
          Kendra Leads
        </Link>

        <Link to="/Popup-Leads" className="sidebar-link">
          <span className="sidebar-icon">
            <FaUsers />
          </span>
          Pop Leads
        </Link>

        <Link to="/getAllUser" className="sidebar-link">
          <span className="sidebar-icon">
            <FaUsers />
          </span>
          ALL USER
        </Link>

        <Link to="/sewa-leads" className="sidebar-link">
          <span className="sidebar-icon">
            <FaCapsules />
          </span>
          Sewa Leads
        </Link>

        <Link to="/Feedbacks" className="sidebar-link">
          <span className="sidebar-icon">
            <FaCapsules />
          </span>
          Feedbacks
        </Link>

        <Link to="/ambulance-leads" className="sidebar-link">
          <span className="sidebar-icon">
            <FaAmbulance />
          </span>
          Ambulance Leads
        </Link>

        <Link to="/insurance-leads" className="sidebar-link">
          <span className="sidebar-icon">
            <FaShieldAlt />
          </span>
          Insurance Leads
        </Link>

        <Link to="/card-apply" className="sidebar-link">
          <span className="sidebar-icon">
            <FaCreditCard />
          </span>
          Card Applys
        </Link>
<Link to="/servicepage-content" className="sidebar-link">
          <span className="sidebar-icon">
            <FaCreditCard />
          </span>
          Servicepage content
        </Link>
        <Link to="/homepage-content" className="sidebar-link">
          <span className="sidebar-icon">
            <FaCreditCard />
          </span>
          Homepage content
        </Link>
        <Link to="/contactpage-content" className="sidebar-link">
          <span className="sidebar-icon">
            <FaCreditCard />
          </span>
          Contactpage content
        </Link>
        <Link to="/empolyee_list" className="sidebar-link">
          <span className="sidebar-icon">
            <FaUserTie />
          </span>
          Employee
        </Link>

        <Link to="/empolyee_location" className="sidebar-link">
          <span className="sidebar-icon">
            <FaUserTie />
          </span>
          Employee location
        </Link>
        <Link to="/allempdata" className="sidebar-link">
          <span className="sidebar-icon">
            <FaUserTie />
          </span>
          Employee Data
        </Link>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Other</p>
        <Link to="/details" className="sidebar-link d-flex align-items-center">
          <span className="sidebar-icon">
            <FaUser />
          </span>
          Profile
        </Link>

        <Link
          to="/createemply"
          className="sidebar-link d-flex align-items-center"
        >
          <span className="sidebar-icon">
            <FaPlus />
          </span>
          Create Employee
        </Link>

        <button
          className="sidebar-link d-flex align-items-center w-100 bg-transparent border-0 text-start"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


//  <div
//           className="sidebar-link d-flex align-items-center justify-content-between"
//           onClick={() => setOpenDropdown(!openDropdown)}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="d-flex align-items-center">
//             <span className="sidebar-icon">
//               <FaPhone />
//             </span>
//             Contact Leads
//           </div>
//           <FaChevronDown
//             style={{
//               transform: openDropdown ? "rotate(180deg)" : "rotate(0deg)",
//               transition: "0.3s",
//             }}
//           />
//         </div>
