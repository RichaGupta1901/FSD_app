import "../styles/Chatbot.css";
import Predictor from "./Predictor";

export default function Chatbot() {
  return (
    <div className="chatbot-container">
      <Predictor />
      <h2>🤖 Chatbot</h2>
      <iframe
        src="https://udify.app/chatbot/Zxzzsa7p9x3jYfN8"
        className="chatbot-iframe"
        frameBorder="0"
        allow="microphone"
        referrerPolicy="no-referrer"
        title="Udify Chatbot"
      ></iframe>
    </div>
  );
}
