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
  FaInfoCircle,
  FaFileAlt,
  FaDatabase,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Sidebar = ({ onLogout }) => {
  const [openAdminDropdown, setOpenAdminDropdown] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [openEmployeeDropdown, setOpenEmployeeDropdown] = useState(false);

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

        {/* === Admin Dropdown === */}
        <div
          className="sidebar-link d-flex align-items-center justify-content-between"
          onClick={() => setOpenAdminDropdown(!openAdminDropdown)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center">
            <span className="sidebar-icon">
              <FaUserTie />
            </span>
            Admin
          </div>
          <FaChevronDown
            style={{
              transform: openAdminDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </div>

        {openAdminDropdown && (
          <div className="dropdown-links ps-4">
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
            <Link to="/job-applications" className="sidebar-link">
              <span className="sidebar-icon">
                <FaHome />
              </span>
              Job Applications
            </Link>
<Link to="/kendra-aprooved" className="sidebar-link">
              <span className="sidebar-icon">
                <FaHome />
              </span>
              Kendra Aprooved Leads
            </Link>
            <Link to="/admin-carrier-page" className="sidebar-link">
              <span className="sidebar-icon">
                <FaHome />
              </span>
              Carriers Page
            </Link>
            <Link to="/admin-kendra-apply" className="sidebar-link">
              <span className="sidebar-icon">
                <FaHome />
              </span>
              Kendra Apply Admin
            </Link>
            <Link to="/Popup-Leads" className="sidebar-link">
              <span className="sidebar-icon">
                <FaUsers />
              </span>
              Pop Leads
            </Link>

            <Link to="/sewa-leads" className="sidebar-link">
              <span className="sidebar-icon">
                <FaCapsules />
              </span>
              Sewa Leads
            </Link>

            <Link to="/Feedbacks" className="sidebar-link">
              <span className="sidebar-icon">
                <FaFileAlt />
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
          </div>
        )}

        {/* === User Dropdown === */}
        <div
          className="sidebar-link d-flex align-items-center justify-content-between"
          onClick={() => setOpenUserDropdown(!openUserDropdown)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center">
            <span className="sidebar-icon">
              <FaUsers />
            </span>
            User
          </div>
          <FaChevronDown
            style={{
              transform: openUserDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </div>

        {openUserDropdown && (
          <div className="dropdown-links ps-4">
            <Link to="/getAllUser" className="sidebar-link">
              <span className="sidebar-icon">
                <FaUsers />
              </span>
              All User
            </Link>

            <Link to="/servicepage-content" className="sidebar-link">
              <span className="sidebar-icon">
                <FaFileAlt />
              </span>
              Servicepage Content
            </Link>

            <Link to="/aboutpage" className="sidebar-link">
              <span className="sidebar-icon">
                <FaInfoCircle />
              </span>
              About Page
            </Link>

            <Link to="/homepage-content" className="sidebar-link">
              <span className="sidebar-icon">
                <FaHome />
              </span>
              Homepage Content
            </Link>

            <Link to="/contactpage-content" className="sidebar-link">
              <span className="sidebar-icon">
                <FaPhone />
              </span>
              Contactpage Content
            </Link>
          </div>
        )}

        {/* === Employee Dropdown === */}
        <div
          className="sidebar-link d-flex align-items-center justify-content-between"
          onClick={() => setOpenEmployeeDropdown(!openEmployeeDropdown)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center">
            <span className="sidebar-icon">
              <FaUserTie />
            </span>
            Employee
          </div>
          <FaChevronDown
            style={{
              transform: openEmployeeDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </div>

        {openEmployeeDropdown && (
          <div className="dropdown-links ps-4">
            <Link to="/empolyee_list" className="sidebar-link">
              <span className="sidebar-icon">
                <FaUserTie />
              </span>
              Employee
            </Link>

            <Link to="/empolyee_location" className="sidebar-link">
              <span className="sidebar-icon">
                <FaMapMarkerAlt />
              </span>
              Employee Location
            </Link>

            <Link to="/allempdata" className="sidebar-link">
              <span className="sidebar-icon">
                <FaDatabase />
              </span>
              Employee Data
            </Link>
          </div>
        )}
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

         <Link
          to="/CreateVendor"
          className="sidebar-link d-flex align-items-center"
        >
          <span className="sidebar-icon">
            <FaPlus />
          </span>
          Create Vendor 
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
