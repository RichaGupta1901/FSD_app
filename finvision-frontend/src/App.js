import React,  { useEffect, useState }  from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthPage from "./components/AuthPage"; 
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import AboutUs from './components/AboutUs';
import ContactUs from "./components/ContactUs";
import Profile from "./components/Profile";
// import Predictor from "./components/Predictor";
import "./styles/App.css"; // Import global CSS
import "./styles/Auth.css";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auth, setAuth] = useState(null);

  // useEffect(() => {
  //   fetch("https://us-central1-finvision-51433.cloudfunctions.net/myFunction")
  //     .then(res => res.text())
  //     .then(data => {
  //       console.log("Response:", data);
  //       alert(data);
  //     })
  //     .catch(err => console.error("Error calling function:", err));
  // }, []);
  
  useEffect(() => {
    axios.get("https://fsd-app-backend.onrender.com/api/auth/check-session", { withCredentials: true })
      .then((res) => {
        setAuth(res.data.user);
        setIsAuthenticated(true); // ✅ set auth flag
      })
      .catch(() => {
        setAuth(null);
        setIsAuthenticated(false); // ✅ reset auth flag
      });
  }, []); 
  
  return (
    <Router>
      <div className="app">
      <Routes>
          {/* Auth layout wrapping login & signup */}
          <Route path="/" element={<AuthPage />}>
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <>
                  <Navbar setAuth={setIsAuthenticated}/>
                  <div className="content">
                    <Sidebar />
                    <Dashboard user={auth}/>
                    {/* <Predictor /> */}
                    <Chatbot />
                  </div>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? (
                <>
                  <Navbar setAuth={setIsAuthenticated} />
                  <div>
                    <AboutUs />
                  </div>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/contact"
            element={
              isAuthenticated ? (
                <>
                  <Navbar setAuth={setIsAuthenticated} />
                  <div>
                    <ContactUs />
                  </div>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <>
                    <Navbar setAuth={setIsAuthenticated}/>
                    <div className="content">
                      <Profile />
                    </div>
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
