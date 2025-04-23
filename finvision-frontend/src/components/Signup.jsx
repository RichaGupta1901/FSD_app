import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Firebase imports
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../components/firebase"; // update the path if needed

axios.defaults.withCredentials = true; // Enable sending cookies with requests

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  // const [demat, setDemat] = useState("");
  const [errors, setErrors] = useState({ email: "", pin: "", demat: "", server: "" });
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", pin: "", demat: "", server: "" };

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

    // if (!demat.trim()) {
    //   newErrors.demat = "Demat Account Number is required";
    //   valid = false;
    // } else if (!/^\d{16}$/.test(demat)) {
    //   newErrors.demat = "Demat must be a 16-digit number";
    //   valid = false;
    // }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      await axios.post("https://fsd-app-backend.onrender.com/api/auth/signup", { email, pin });
      navigate("/login");
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        server: err.response?.data?.message || "Signup failed",
      }));
    }
  };

  const handleGoogleSignup = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email, uid } = user;

      // Save user info to your backend (demat not included)
      await axios.post("https://fsd-app-backend.onrender.com/api/auth/saveUser", {
        name: displayName,
        email,
        uid
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      setErrors(prev => ({
        ...prev,
        server: "Google signup failed. Please try again.",
      }));
    }
  };

  return (
    <div className="auth-form">
      <div className="login-glass-container">
        <h2>Signup</h2>
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

        {/* <input
          type="text"
          placeholder="Demat Account No. (16 digits)"
          value={demat}
          onChange={e => setDemat(e.target.value)}
        /> */}
        {errors.demat && <p style={{ color: "salmon" }}>{errors.demat}</p>}

        {errors.server && <p style={{ color: "salmon" }}>{errors.server}</p>}

        <button onClick={handleSignup}>Signup</button>

        <div style={{ margin: "1rem 0", textAlign: "center" }}>
          <p>OR</p>
          <button onClick={handleGoogleSignup} style={{ backgroundColor: "#4285F4", color: "white" }}>
            Sign up with Google
          </button>
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
