// AuthPage.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/Auth.css";
import ThemeToggle from "./ThemeToggle"; 

function AuthPage() {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <Outlet />
      </div>
      <div className="auth-right">
        <ThemeToggle />
        <div className="branding">
          <h1>Welcome to FinVision</h1>
          <p>Your smart gateway to market insights</p>
          <div className="chart-card">
            <h3 className="auth-growth">+84.32%</h3>
            <div className="auth-chart">
                <div className="bar" style={{ height: "30%" }}></div>
                <div className="bar" style={{ height: "50%" }}></div>
                <div className="bar" style={{ height: "70%" }}></div>
                <div className="bar" style={{ height: "90%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
