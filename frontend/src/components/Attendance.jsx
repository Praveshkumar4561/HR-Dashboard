import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import Customer from "../assets/Customer.png";
import { useParams } from "react-router-dom";
import axios from "axios";

function Attendance() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [candidate, setCandidate] = useState([]);
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (search.trim()) {
      searchbar();
    } else {
      alldata();
    }
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

  const deletedata = async (id) => {
    try {
      await axios.delete(`${API_URL}/candidatedelete/${id}`);
      alldata();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(`${API_URL}/candidatesome/${id}`);
        setCandidate(response.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (id, newStatus) => {
    setStatuses((s) => ({ ...s, [id]: newStatus }));
    try {
      await axios.post(`${API_URL}/update-status`, {
        id,
        status: newStatus,
      });
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const [positions, setPositions] = useState("");

  let [show, setShow] = useState(false);

  let showdropdown = () => {
    setShow(!show);
  };

  return (
    <>
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="candidate-profile1">
            <h1 className="candidate-heading">Attendance</h1>

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
              <select
                value={positions}
                onChange={(e) => setPositions(e.target.value)}
                className={`position-select ${positions ? "selected" : ""}`}
              >
                <option value="">Position</option>
                <option value="Designer">Designer</option>
                <option value="Developer">Developer</option>
                <option value="Human Resources">Human Resources</option>
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
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
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
                    <td>{data.position}</td>
                    <td>{data.position}</td>
                    <td>
                      <select
                        value={current}
                        onChange={(e) =>
                          handleStatusChange(data._id, e.target.value)
                        }
                        className={`select-status ${
                          current === "Absent"
                            ? "status-absent"
                            : current === "Present"
                            ? "status-present"
                            : ""
                        }`}
                      >
                        <option value="New" hidden>
                          New
                        </option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>

                    <td>
                      <div className="actions">
                        <button className="btn-more" onClick={showdropdown}>
                          ⋮
                        </button>
                        {show && (
                          <>
                            <div className="dropdown-employee">
                              <button>Edit</button>
                              <button onClick={() => deletedata(data._id)}>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ color: "red", textAlign: "center" }}>
                  No candidate available for your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default Attendance;
