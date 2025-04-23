import React from 'react';
import '../styles/ContactUs.css';

export default function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1>Contact Us</h1>
        
        <section className="contact-section">
          <h2>Customer Support</h2>
          <p>We're here to help! Reach out to us through any of these channels:</p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <h3>Email Support</h3>
              <p>support@finvision.com</p>
              <p>Response time: Within 24 hours</p>
            </div>
            
            <div className="contact-method">
              <h3>Phone Support</h3>
              <p>+91 9049944873</p>
              <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            </div>
            
            <div className="contact-method">
              <h3>Office Address</h3>
              <p>Symbiosis International University</p>
              <p>Pune, Maharashtra 412115</p>
              <p>India</p>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <select required>
                <option value="">Select Topic</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </section>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>How do I link my portfolio?</h3>
              <p>You can link your portfolio by clicking the "Link Portfolio" button in the navigation bar and choosing either Upstox integration or CSV upload.</p>
            </div>
            <div className="faq-item">
            <h3>How can I download my stock holdings (CSV/Excel) from platforms like Groww, Upstox, Zerodha, etc.?</h3>
            <p>
                Most trading platforms like <strong>Groww, Upstox, Zerodha, Angel One, Sharekhan</strong>, and others allow you to export your stock holdings in just a few steps:
            </p>
            <ol className="list-decimal list-inside pl-4">
                <li><strong>Log in</strong> to your trading account (web or mobile).</li>
                <li>Navigate to the <strong>"Portfolio"</strong> or <strong>"Holdings"</strong> section.</li>
                <li>Look for a <strong>Download</strong> or <strong>Export</strong> button (or a three-dot menu).</li>
                <li>Select <strong>"Download as CSV"</strong> or <strong>"Export to Excel"</strong>.</li>
            </ol>
            <p className="mt-2">
                <em>If the option isn’t visible, check the console/report section or try using the mobile app.</em>
            </p>
            </div>
            <div className="faq-item">
              <h3>Is my financial data secure?</h3>
              <p>Yes, we use industry-standard encryption and security measures to protect your data. Your information is stored securely and never shared without your consent.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}