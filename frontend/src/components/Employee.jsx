import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import Customer from "../assets/Customer.png";
import axios from "axios";

function Employee() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [leaveDate, setLeaveDate] = useState("");

  const handleDateFocus = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    setLeaveDate(formattedDate);
  };

  let [show, setShow] = useState(false);

  let showdropdown = () => {
    setShow(!show);
  };

  let [candidate, setCandidate] = useState([]);
  let [search, setSearch] = useState("");

  useEffect(() => {
    let intervalId;

    if (search.trim()) {
      searchbar();
    } else {
      alldata();
      intervalId = setInterval(alldata, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [search]);

  const alldata = async () => {
    try {
      const response = await axios.get(`${API_URL}/allcandidatedata`);
      setCandidate(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const searchbar = async () => {
    try {
      const response = await axios.get(`${API_URL}/candidatesearch/${search}`);
      setCandidate(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const [statuses, setStatuses] = useState({});
  const [candidates, setCandidates] = useState([]);

  const handleDepartmentChange = async (id, newDepartment) => {
    setStatuses((s) => ({ ...s, [id]: newDepartment }));

    try {
      await axios.post(`${API_URL}/department-update`, {
        id,
        department: newDepartment,
      });
      console.log("Department updated successfully");
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  let deletedata = async (id) => {
    try {
      await axios.delete(`${API_URL}/candidatedelete/${id}`);
      alldata();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${API_URL}/candidates`);
        setCandidates(res.data);

        const initialStatuses = {};
        res.data.forEach((c) => {
          if (c.department) {
            initialStatuses[c._id] = c.department;
          }
        });
        setStatuses(initialStatuses);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <>
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="candidate-profile1">
            <h1 className="candidate-heading">Employees</h1>

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
                <option>Position</option>
                <option>Designer</option>
                <option>Developer</option>
                <option>Human Resources</option>
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
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        <table className="cand-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {candidate.length > 0 ? (
              candidate.map((data, idx) => {
                const current = statuses[data._id] ?? data.status ?? "New";
                const hasValue = current !== "New";

                return (
                  <tr key={data._id}>
                    <td>{idx + 1}</td>
                    <td>{data.fullname}</td>
                    <td>{data.email}</td>
                    <td>{data.phone}</td>
                    <td>{data.position}</td>

                    <td>
                      <select
                        value={current}
                        onChange={(e) =>
                          handleDepartmentChange(data._id, e.target.value)
                        }
                        className={`select-status${
                          hasValue ? " has-value" : ""
                        }`}
                      >
                        <option value="New" hidden>
                          New
                        </option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="OnGoing">OnGoing</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td>{data.experience}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-more" onClick={showdropdown}>
                          ⋮
                        </button>
                        {show && (
                          <>
                            <div className="dropdown-employee">
                              <button onClick={openModal}>Edit</button>
                              <button onClick={() => deletedata(data._id)}>
                                Delete
                              </button>
                            </div>
                          </>
                        )}

                        <div
                          className={`candidate-modal ${
                            showModal ? "show" : ""
                          }`}
                        >
                          <div className="modal-header">
                            <h3 className="new-candidate">
                              Edit Employee Details
                            </h3>
                            <span className="close-icon" onClick={closeModal}>
                              &times;
                            </span>
                          </div>

                          <form>
                            <div className="modal-form">
                              <div className="form-row">
                                <input
                                  type="text"
                                  placeholder="Full Name*"
                                  required
                                />
                                <input
                                  type="email"
                                  placeholder="Email Address*"
                                  required
                                />
                              </div>

                              <div className="form-row">
                                <input
                                  type="text"
                                  placeholder="Phone Number*"
                                />
                                <input
                                  type="text"
                                  placeholder="Department*"
                                  required
                                />
                              </div>

                              <div className="form-row">
                                <div className="input-box">
                                  <select
                                    id="position"
                                    name="position"
                                    required
                                    className="custom-select"
                                  >
                                    <option value="Intern">Intern</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Team Lead">Team Lead</option>
                                  </select>
                                </div>

                                <div className="input-box">
                                  <input
                                    type="text"
                                    placeholder="Leave Date*"
                                    required
                                    onFocus={handleDateFocus}
                                    value={leaveDate}
                                    onChange={(e) =>
                                      setLeaveDate(e.target.value)
                                    }
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
                              </div>

                              <button className="save-btn" type="submit">
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">
                  <span
                    style={{
                      color: "red",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    No candidate available for your search
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default Employee;
