import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import Customer from "../assets/Customer.png";
import axios from "axios";

function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
  });
  const { fullname, email, phone, position, experience, resume } = form;

  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const fileInputRef = useRef(null);

  const onInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, resume: file });
      setFileName(file.name);
      setFileSelected(true);
    }
  };

  const handleClick = () => {
    if (fileSelected) {
      setForm({ ...form, resume: null });
      setFileName("");
      setFileSelected(false);
      fileInputRef.current.value = null;
    } else {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("fullname", fullname);
      data.append("email", email);
      data.append("phone", phone);
      data.append("position", position);
      data.append("experience", experience);
      data.append("resume", resume);

      await axios.post("http://localhost:2100/api/candidatecreate", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        fullname: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resume: null,
      });
      setFileName("");
      setFileSelected(false);
      closeModal();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message &&
        err.response.data.message.toLowerCase().includes("already exists")
      ) {
        alert(
          "That email has already been used. Please enter a different one."
        );
      } else {
        console.error("Error submitting candidate:", err);
        alert("Failed to add candidate");
      }
    }
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
      const response = await axios.get(
        "http://localhost:2100/api/allcandidatedata"
      );
      setCandidate(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const searchbar = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2100/api/candidatesearch/${search}`
      );
      setCandidate(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  let deletedata = async (id) => {
    try {
      await axios.delete(`http://localhost:2100/api/candidatedelete/${id}`);
      alldata();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const [statuses, setStatuses] = useState({});

  function handleStatusChange(id, newStatus) {
    setStatuses((s) => ({ ...s, [id]: newStatus }));
  }

  let [show, setShow] = useState(false);

  let showdropdown = () => {
    setShow(!show);
  };

  return (
    <>
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="candidate-profile1">
            <h1 className="candidate-heading">Candidates</h1>

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
                className="select-status"
                onChange={(e) =>
                  e.currentTarget.setAttribute("data-status", e.target.value)
                }
              >
                <option value="New">New</option>
                <option value="Scheduled">Scheduled</option>
                <option value="OnGoing">OnGoing</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                defaultValue="Position"
                data-value="Position"
                className="select-box"
                onChange={(e) =>
                  e.currentTarget.setAttribute("data-value", e.target.value)
                }
              >
                <option value="Position" disabled hidden>
                  Position
                </option>
                <option value="Designer">Designer</option>
                <option value="Developer">Developer</option>
                <option value="Intern">Intern</option>
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

              <button className="btn-add" onClick={openModal}>
                Add Candidate
              </button>
            </div>

            <div className={`candidate-modal ${showModal ? "show" : ""}`}>
              <div className="modal-header">
                <h3 className="new-candidate">Add New Candidate</h3>
                <span className="close-icon" onClick={closeModal}>
                  &times;
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Full Name*"
                      name="fullname"
                      value={fullname}
                      onChange={onInputChange}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address*"
                      name="email"
                      value={email}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Phone Number*"
                      name="phone"
                      value={phone}
                      onChange={onInputChange}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Position*"
                      name="position"
                      value={position}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="input-box">
                      <input
                        type="text"
                        placeholder="Experience*"
                        name="experience"
                        value={experience}
                        onChange={onInputChange}
                        required
                      />
                    </div>

                    <div className="input-box">
                      <input
                        type="text"
                        placeholder="Resume*"
                        readOnly
                        value={fileName}
                        onClick={handleClick}
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
                        accept=".pdf,image/*"
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  <div className="declaration">
                    <input type="checkbox" id="declare" required />
                    <label htmlFor="declare" className="declare-text">
                      I hereby declare that the above information is true to the
                      best of my knowledge and belief
                    </label>
                  </div>

                  <button className="save-btn" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </header>

        <table className="cand-table">
          <thead>
            <tr>
              <th>Sr. no.</th>
              <th>Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
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
                          handleStatusChange(data._id, e.target.value)
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
                          <div className="dropdown">
                            <button>Download Resume</button>
                            <button onClick={() => deletedata(data._id)}>
                              Delete Candidate
                            </button>
                          </div>
                        )}
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

export default AdminDashboard;
