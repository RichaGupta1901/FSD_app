import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { getAuth } from "firebase/auth"; // 👈 import Firebase auth
import axios from "axios";
axios.defaults.withCredentials = true;
//const axios = require("axios");

export default function Navbar({ setAuth }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const auth = getAuth(); // 👈 get auth instance
  const user = auth.currentUser; // 👈 get current user
  const navigate = useNavigate();

  const toggleOptions = () => setShowOptions(!showOptions);
  const toggleProfileOptions = () => setShowProfileOptions(!showProfileOptions);

  const handleUpstoxClick = async () => {
    // Clear any previous errors
    localStorage.removeItem("importError");

    // Redirect to Upstox auth (backend will handle redirecting back to dashboard after)
    window.location.href = "http://localhost:8000/api/upstox/auth";
  };

  const handleCsvUploadClick = () => {
    document.getElementById("csvUploadInput").click();
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    localStorage.setItem("userEmail", user?.email);

    fetch("http://localhost:8000/api/portfolio/upload", {
      method: "POST",
      headers: {
        "x-user-email": user?.email,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.importError) {
          localStorage.setItem("importError", data.message);
        } else {
          localStorage.removeItem("importError");
        }

        // Redirect to dashboard regardless
        window.location.href = "/dashboard";
      })
      .catch(err => {
        console.error("❌ CSV Upload Error:", err);
        localStorage.setItem("importError", "CSV upload failed. Please try again.");
        window.location.href = "/dashboard";
      });
  };

  const handleAboutClick = () => {
    navigate("/about");
  };

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleContactClick = () => {
    navigate("/contact");   
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setAuth(false);
      navigate("/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
      console.log(`Logout failed by ${user?.email}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="logo_fin.png" alt="Logo" className="logo" />
        <h1 className="title">FinVision</h1>
      </div>
      <div className="menu">
        <button className="home-btn" onClick={handleHomeClick}>Home</button>
        <button className="about-btn" onClick={handleAboutClick}>About Us</button>
        <button className="contact-btn" onClick={handleContactClick}>Contact Us</button>
        <div className="portfolio-wrapper">
          <button className="portfolio-btn" onClick={toggleOptions}>
            Link Portfolio
          </button>
          {showOptions && (
            <div className="portfolio-options">
              <button onClick={handleUpstoxClick}>Link with Upstox</button>
              <button onClick={handleCsvUploadClick}>Upload Excel/CSV</button>
              <input
                type="file"
                accept=".csv, .xls, .xlsx"
                id="csvUploadInput"
                style={{ display: "none" }}
                onChange={handleCsvFileChange}
              />
            </div>
          )}
        </div>
      </div> 
      <div className="profile-wrapper" onClick={toggleProfileOptions}>
          <div className="profile">
            <img src="/profile_img.png" className="profile-img" alt="User" />
            <span className="username">{user?.email?.split("@")[0]}</span>
          </div>

          {showProfileOptions && (
            <div className="profile-dropdown">
              <button onClick={handleProfile}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
    </nav>
  );
}
