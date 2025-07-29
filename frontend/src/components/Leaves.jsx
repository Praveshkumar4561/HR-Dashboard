import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import Customer from "../assets/Customer.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Leaves() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateFocus = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;

    setFormData((prevData) => ({
      ...prevData,
      leavedate: formattedDate,
    }));
  };

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);

  const handleClick = () => {
    if (fileSelected) {
      setFileName("");
      setFileSelected(false);
      fileInputRef.current.value = null;
    } else {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const getLeaveCountForDay = (day) => {
    return approvedLeaves.filter(
      (leave) =>
        leave.date.getDate() === day &&
        leave.date.getMonth() === currentDate.getMonth() &&
        leave.date.getFullYear() === currentDate.getFullYear()
    ).length;
  };

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeavesData = async () => {
      try {
        const response = await axios.get(`${API_URL}/leavesdata`);

        const allLeaves = response.data || [];
        const approved = allLeaves.filter((item) => item.status === "approved");

        const parsed = approved.map((item) => {
          const [day, month, year] = item.leavedate.split("/");
          const parsedDate = new Date(`${year}-${month}-${day}`);
          return {
            ...item,
            date: parsedDate,
          };
        });

        setLeaves(allLeaves);
        setApprovedLeaves(parsed);
        setApprovedCount(parsed.length);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchLeavesData();

    const intervalId = setInterval(fetchLeavesData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChanges = async (e, id) => {
    const newStatus = e.target.value;
    const oldLeaves = [...leaves];

    setLeaves((prev) =>
      prev.map((leave) =>
        leave._id === id ? { ...leave, status: newStatus } : leave
      )
    );

    try {
      await axios.post(`${API_URL}/leave-approve`, {
        id,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update. Please try again.");
      setLeaves(oldLeaves);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "#555";
    }
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const [allCandidates, setAllCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${API_URL}/allcandidatedata`);
        setAllCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = allCandidates
      .filter((item) => item.status === "Present")
      .filter((item) =>
        item.fullname.toLowerCase().includes(value.toLowerCase())
      );

    setFilteredCandidates(filtered);
  };

  const handleSelectName = (name) => {
    const selected = allCandidates.find((c) => c.fullname === name);
    setSearch(name);
    setFilteredCandidates([]);

    if (selected) {
      setFormData((prevData) => ({
        ...prevData,
        employeename: selected.fullname,
        designation: selected.designation || "",
      }));
    }
  };

  const [formData, setFormData] = useState({
    employeename: "",
    designation: "",
    leavedate: "",
    reason: "",
    document: null,
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${API_URL}/allcandidatedata`);
        setAllCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post(`${API_URL}/leavepost`, data);

      closeModal();

      setFormData({
        employeename: "",
        designation: "",
        leavedate: "",
        reason: "",
        document: null,
      });
      setSearch("");
      setFileName("");
      setFileSelected(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error while submitting leave.");
    }
  };

  return (
    <>
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="candidate-profile1">
            <h1 className="candidate-heading">Leaves</h1>

            <div className="candidate-icons">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4L8.8906 9.2604C9.5624 9.70827 10.4376 9.70827 11.1094 9.2604L19 4M3 15H17C18.1046 15 19 14.1046 19 13V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15Z"
                  stroke="#121212"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="frame-span"></span>

              <svg
                width="56"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5.5C14.7614 5.5 17 7.73858 17 10.5V12.7396C17 13.2294 17.1798 13.7022 17.5052 14.0683L18.7808 15.5035C19.6407 16.4708 18.954 18 17.6597 18H6.34025C5.04598 18 4.35927 16.4708 5.21913 15.5035L6.4948 14.0683C6.82022 13.7022 6.99998 13.2294 6.99998 12.7396L7 10.5C7 7.73858 9.23858 5.5 12 5.5ZM12 5.5V3M10.9999 21H12.9999"
                  stroke="#121212"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="frame-span1"></span>

              <div className="profile-app">
                <img src={Customer} alt="profile" className="profile-img" />
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L5.29289 5.79289C5.68342 6.18342 6.31658 6.18342 6.70711 5.79289L11 1.5"
                    stroke="#4D007D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="candidate-profile">
            <div className="filters">
              <select>
                <option>Status</option>
                <option>New</option>
                <option>Scheduled</option>
                <option>Scheduled</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="header-right">
              <div className="search-container-admin">
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
                <input type="search" placeholder="Search" />
              </div>

              <button className="btn-leave" onClick={openModal}>
                Add Leave
              </button>
            </div>

            <div className={`candidate-modal ${showModal ? "show" : ""}`}>
              <div className="modal-header">
                <h3 className="leave-add">Add New Leave</h3>
                <span className="close-icon" onClick={closeModal}>
                  &times;
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-form">
                  <div className="form-row">
                    <div
                      className="input-icon-wrapper"
                      style={{ position: "relative" }}
                    >
                      <svg
                        className="search-icon"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.15725 9.15749L13.833 13.8333M5.91634 10.4999C8.44765 10.4999 10.4997 8.44789 10.4997 5.91659C10.4997 3.38528 8.44765 1.33325 5.91634 1.33325C3.38504 1.33325 1.33301 3.38528 1.33301 5.91659C1.33301 8.44789 3.38504 10.4999 5.91634 10.4999Z"
                          stroke="#4D007D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        type="text"
                        className="employess-input"
                        placeholder="Search Employee Name"
                        value={search}
                        onChange={handleSearch}
                        required
                        name="employeename"
                      />
                    </div>

                    {search && filteredCandidates.length > 0 && (
                      <ul
                        className="search-dropdown"
                        style={{
                          position: "absolute",
                          top: "124px",
                          width: "20%",
                          background: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          zIndex: 10,
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {filteredCandidates.map((candidate) => (
                          <li
                            key={candidate._id}
                            onClick={() => handleSelectName(candidate.fullname)}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {candidate.fullname}
                          </li>
                        ))}
                      </ul>
                    )}

                    <input
                      type="text"
                      placeholder="Designation*"
                      required
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="input-box">
                      <input
                        type="text"
                        placeholder="Leave Date*"
                        required
                        name="leavedate"
                        onFocus={handleDateFocus}
                        value={formData.leavedate}
                        onChange={handleChange}
                      />
                      <span className="icon">
                        <svg
                          className="svg-icon-w3"
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.6663 6.5H1.33301M3.83301 1.5V3.16667M12.1663 1.5V3.16667M11.333 11.9167C11.333 12.607 10.7734 13.1667 10.083 13.1667C9.39265 13.1667 8.83301 12.607 8.83301 11.9167C8.83301 11.2263 9.39265 10.6667 10.083 10.6667C10.7734 10.6667 11.333 11.2263 11.333 11.9167ZM3.33301 16.5H12.6663C13.7709 16.5 14.6663 15.6046 14.6663 14.5V5.16667C14.6663 4.0621 13.7709 3.16667 12.6663 3.16667H3.33301C2.22844 3.16667 1.33301 4.0621 1.33301 5.16666V14.5C1.33301 15.6046 2.22844 16.5 3.33301 16.5Z"
                            stroke="#4D007D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div className="input-box">
                      <input
                        type="text"
                        placeholder="Documents*"
                        readOnly
                        value={fileName}
                        required
                        onClick={handleClick}
                        name="document"
                      />

                      <span
                        className="icon"
                        onClick={handleClick}
                        style={{ cursor: "pointer" }}
                      >
                        {fileSelected ? (
                          <svg
                            width="16"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 18L18 6M6 6L18 18"
                              stroke="#FF0000"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.33301 12.1666V13.8333C1.33301 14.2753 1.5086 14.6992 1.82116 15.0118C2.13372 15.3243 2.55765 15.4999 2.99967 15.4999H12.9997C13.4417 15.4999 13.8656 15.3243 14.1782 15.0118C14.4907 14.6992 14.6663 14.2753 14.6663 13.8333V12.1666M3.83301 5.49992L7.99967 1.33325M7.99967 1.33325L12.1663 5.49992M7.99967 1.33325V11.3333"
                              stroke="#4D007D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf, image/*"
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  <div className="form-row reason-text">
                    <input
                      type="text"
                      placeholder="Reason*"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button className="save-leave" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </header>

        <div className="leave-container">
          <div className="leave-left">
            <h3 className="section-header">Applied Leaves</h3>
            <div className="leave-table">
              <div className="table-header">
                <span>Profile</span>
                <span>Name</span>
                <span>Date</span>
                <span>Reason</span>
                <span>Status</span>
                <span>Docs</span>
              </div>

              {Array.isArray(leaves) && leaves.length > 0 ? (
                leaves.map((data, key) => (
                  <div className="table-row" key={key}>
                    <div className="profile">
                      <img
                        src="https://i.pravatar.cc/40?img=1"
                        alt="profile"
                        className="profile-img"
                      />
                      <div></div>
                    </div>

                    <div className="fisher-backend">
                      <span>{data.employeename}</span>
                      <span>{data.designation}</span>
                    </div>

                    <span>{data.leavedate}</span>
                    <span>{data.reason}</span>

                    <span>
                      <div className="dropdown-wrapper">
                        <div
                          className="fake-label"
                          style={{ color: getColor(data.status) }}
                        >
                          {data.status
                            ? data.status.charAt(0).toUpperCase() +
                              data.status.slice(1)
                            : "Pending"}
                        </div>

                        <select
                          className="status"
                          value={data.status || "pending"}
                          onChange={(e) => handleChanges(e, data._id)}
                        >
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        <span className="arrow">
                          <FontAwesomeIcon icon={faAngleDown} />
                        </span>
                      </div>
                    </span>

                    <span>📄</span>
                  </div>
                ))
              ) : (
                <div className="no-leaves-message">
                  No leaves available at the current time.
                </div>
              )}
            </div>
          </div>

          <div className="leave-right">
            <h3 className="section-header">Leave Calendar</h3>

            <div className="calendar-container">
              <div className="calendar-header">
                <span>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className="angle-arrow"
                    onClick={prevMonth}
                  />{" "}
                  {monthName}, {year}{" "}
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className="angle-arrow"
                    onClick={nextMonth}
                  />
                </span>
              </div>

              <div className="calendar-grid">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div key={index} className="calendar-day-label">
                    {day}
                  </div>
                ))}

                {Array(getFirstDayOfMonth(currentDate))
                  .fill("")
                  .map((_, i) => (
                    <div key={"empty-" + i}></div>
                  ))}

                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                  const day = i + 1;
                  const count = getLeaveCountForDay(day);

                  return (
                    <div
                      key={i}
                      className={`calendar-day ${
                        count > 0 ? "highlighted" : ""
                      }`}
                    >
                      {day}
                      {count > 0 && <div className="leave-count">{count}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="approved-list">
              <h4>Approved Leaves</h4>

              {leaves
                .filter((data) => data.status === "approved")
                .map((data, index) => {
                  let leaveDateStr = data.leavedate;
                  let formattedDate = "Invalid Date";

                  if (leaveDateStr && leaveDateStr.includes("/")) {
                    const [day, month, year] = leaveDateStr.split("/");
                    const parsedDate = new Date(year, month - 1, day);
                    formattedDate = `${String(
                      parsedDate.getMonth() + 1
                    ).padStart(2, "0")}/${String(parsedDate.getDate()).padStart(
                      2,
                      "0"
                    )}/${parsedDate.getFullYear()}`;
                  }

                  return (
                    <div className="approved-item" key={index}>
                      <img
                        src="https://i.pravatar.cc/40?img=1"
                        alt="profile"
                        className="profile-img"
                      />
                      <div>
                        <div className="title">{data.employeename}</div>
                        <div className="title">{data.reason}</div>
                      </div>
                      <div className="leave-date">{formattedDate}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Leaves;
