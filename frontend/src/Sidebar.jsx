import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [log, setLog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = () => {
  setIsSidebarOpen((prev) => !prev);
};


  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("isAuthenticated");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const sidebarData = [
    {
      section: "Recruitment",
      items: [
        {
          label: "Candidates",
          path: "/admin/dashboard",
          icon: (
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 7.16659H5.66667M3.58333 9.24992V5.08325M11.0833 9.66659C14.0903 9.66659 15.6951 10.6733 16.2609 12.6867C16.5598 13.75 15.6046 14.6666 14.5 14.6666H7.66666C6.56209 14.6666 5.60687 13.75 5.90573 12.6867C6.47159 10.6733 8.07637 9.66659 11.0833 9.66659ZM11.0833 6.33325C12.4722 6.33325 13.1667 5.61897 13.1667 3.83325C13.1667 2.04754 12.4722 1.33325 11.0833 1.33325C9.69444 1.33325 9 2.04754 9 3.83325C9 5.61897 9.69444 6.33325 11.0833 6.33325Z"
                stroke="#4D007D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      section: "Organization",
      items: [
        {
          label: "Employees",
          path: "/admin/employees",
          icon: (
            <svg
              width="17"
              height="14"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4209 12.8334H14.6667C15.5871 12.8334 16.3891 12.0634 16.0967 11.1906C15.651 9.86049 14.5546 9.05612 12.6273 8.7775M10.0834 6.05382C10.3259 6.13047 10.6037 6.16675 10.9167 6.16675C12.3056 6.16675 13 5.45246 13 3.66675C13 1.88103 12.3056 1.16675 10.9167 1.16675C10.6037 1.16675 10.3259 1.20303 10.0834 1.27968M5.91667 8.66675C8.73628 8.66675 10.323 9.40438 10.9763 10.8796C11.4236 11.8896 10.4379 12.8334 9.33333 12.8334H2.5C1.39543 12.8334 0.409756 11.8896 0.857021 10.8796C1.51034 9.40438 3.09706 8.66675 5.91667 8.66675ZM5.91667 6.16675C7.30556 6.16675 8 5.45246 8 3.66675C8 1.88103 7.30556 1.16675 5.91667 1.16675C4.52778 1.16675 3.83333 1.88103 3.83333 3.66675C3.83333 5.45246 4.52778 6.16675 5.91667 6.16675Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          label: "Attendance",
          path: "/admin/attendance",
          icon: (
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.33325 5.33333C6.33325 4.78105 6.78097 4.33333 7.33325 4.33333H8.66659C9.21887 4.33333 9.66659 4.78105 9.66659 5.33333V11.6667C9.66659 12.219 9.21887 12.6667 8.66659 12.6667H7.33325C6.78097 12.6667 6.33325 12.219 6.33325 11.6667V5.33333Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.33325 8.66667C1.33325 8.11438 1.78097 7.66667 2.33325 7.66667H3.66659C4.21887 7.66667 4.66659 8.11438 4.66659 8.66667V11.6667C4.66659 12.219 4.21887 12.6667 3.66659 12.6667H2.33325C1.78097 12.6667 1.33325 12.219 1.33325 11.6667V8.66667Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3333 2C11.3333 1.44772 11.781 1 12.3333 1H13.6666C14.2189 1 14.6666 1.44772 14.6666 2V11.6667C14.6666 12.219 14.2189 12.6667 13.6666 12.6667H12.3333C11.781 12.6667 11.3333 12.219 11.3333 11.6667V2Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          label: "Leaves",
          path: "/admin/leaves",
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.33325 1.33325C6.33325 4.09468 4.09468 6.33325 1.33325 6.33325C4.09468 6.33325 6.33325 8.57183 6.33325 11.3333C6.33325 8.57183 8.57183 6.33325 11.3333 6.33325C8.57183 6.33325 6.33325 4.09468 6.33325 1.33325Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5833 10.4999C12.5833 11.6505 11.6505 12.5833 10.4999 12.5833C11.6505 12.5833 12.5833 13.516 12.5833 14.6666C12.5833 13.516 13.516 12.5833 14.6666 12.5833C13.516 12.5833 12.5833 11.6505 12.5833 10.4999Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      section: "Others",
      items: [
        {
          label: "Logout",
          path: "#",
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.33325 1.33325C6.33325 4.09468 4.09468 6.33325 1.33325 6.33325C4.09468 6.33325 6.33325 8.57183 6.33325 11.3333C6.33325 8.57183 8.57183 6.33325 11.3333 6.33325C8.57183 6.33325 6.33325 4.09468 6.33325 1.33325Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5833 10.4999C12.5833 11.6505 11.6505 12.5833 10.4999 12.5833C11.6505 12.5833 12.5833 13.516 12.5833 14.6666C12.5833 13.516 13.516 12.5833 14.6666 12.5833C13.516 12.5833 12.5833 11.6505 12.5833 10.4999Z"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          onClick: () => setLog(true),
        },
      ],
    },
  ];

  const filteredSidebar = sidebarData
    .map((section) => {
      const filteredItems = section.items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      return filteredItems.length > 0
        ? { ...section, items: filteredItems }
        : null;
    })
    .filter(Boolean);

  return (
    <>
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? "✖" : "☰"}
        </button>
        <h2 className="mobile-title">Dashboard</h2>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <aside  className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-1">
          <Link to="/admin/dashboard">
            <span className="logo-icon">▢</span>
            <span className="logo-text">LOGO</span>
          </Link>
        </div>

        <div className="search-box">
          <svg
            className="search-icon"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.15774 9.15749L13.8335 13.8333M5.91683 10.4999C8.44813 10.4999 10.5002 8.44789 10.5002 5.91659C10.5002 3.38528 8.44813 1.33325 5.91683 1.33325C3.38552 1.33325 1.3335 3.38528 1.3335 5.91659C1.3335 8.44789 3.38552 10.4999 5.91683 10.4999Z"
              stroke="#A4A4A4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {filteredSidebar.map((section, index) => (
          <div className="section" key={index}>
            <p className="section-title">{section.section}</p>
            {section.items.map((item, idx) => (
              <Link
                to={item.path}
                className="menu-item"
                key={idx}
                onClick={item.onClick || null}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </aside>

      {log && (
        <div className="custom-box show">
          <div className="custom-header">Log Out</div>
          <div className="custom-body">
            <p className="custom-message">Are you sure you want to log out?</p>
            <div className="custom-actions">
              <button
                className="custom-btn cancel"
                onClick={() => setLog(false)}
              >
                Cancel
              </button>
              <button className="custom-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
