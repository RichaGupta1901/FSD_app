import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Firebase imports
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../components/firebase"; // adjust the path if needed

axios.defaults.withCredentials = true; // Enable sending cookies with requests

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState({ email: "", pin: "", auth: "" });
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", pin: "", auth: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!pin.trim()) {
      newErrors.pin = "PIN is required";
      valid = false;
    } else if (!/^\d{4}$/.test(pin)) {
      newErrors.pin = "PIN must be a 4-digit number";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", { email, pin }, { withCredentials: true });
      if (res.status === 200) {
        setAuth(true);
        navigate("/dashboard");
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        auth: err.response?.data?.message || "Login failed",
      }));
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email, uid } = user;

      // Send user info to your Flask backend
      await axios.post("http://localhost:8000/api/auth/saveUser", {
        name: displayName,
        email,
        uid
      }, { withCredentials: true });

      setAuth(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrors(prev => ({
        ...prev,
        auth: "Google login failed. Please try again.",
      }));
    }
  };

  return (
    <div className="auth-form">
      <div className="login-glass-container">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: "salmon" }}>{errors.email}</p>}

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
        />
        {errors.pin && <p style={{ color: "salmon" }}>{errors.pin}</p>}

        {errors.auth && <p style={{ color: "salmon" }}>{errors.auth}</p>}

        <button onClick={handleLogin}>Login</button>

        <div style={{ margin: "1rem 0", textAlign: "center" }}>
          <p>OR</p>
          <button onClick={handleGoogleLogin} style={{ backgroundColor: "#4285F4", color: "white" }}>
            Sign in with Google
          </button>
        </div>

        <p className="auth-switch">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
