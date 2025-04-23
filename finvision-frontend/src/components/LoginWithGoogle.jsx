import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase"; // your firebase config file
import axios from "axios";
axios.defaults.withCredentials = true;

const LoginWithGoogle = () => {
  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log("Google user:", user); // <== THIS SHOULD WORK
        })
        .catch((err) => {
            console.error("Google Auth Error:", err.message); // <== Check this!
      });
      const { email } = result.user;

      // Send to backend to register/login
      await axios.post("http://localhost:8000/api/auth/signup", {
        email: result.user.email,
        name: result.user.displayName,
        uid: result.user.uid,
      });

      // Then redirect or show success
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <button className="google-btn" onClick={handleGoogleLogin}>
      <img src="/google-icon.svg" alt="Google" style={{ width: 20, marginRight: 8 }} />
      Continue with Google
    </button>
  );
};

export default LoginWithGoogle;
