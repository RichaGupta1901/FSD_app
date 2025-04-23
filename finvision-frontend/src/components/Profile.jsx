import React from 'react';
import { getAuth } from 'firebase/auth';
import '../styles/Profile.css';

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img 
          src='./profile_img.png'
          alt="Profile" 
          className="profile-avatar"
        />
        <h1>{user?.displayName || user?.email?.split('@')[0]}</h1>
        <p>{user?.email}</p>
      </div>

      <div className="profile-sections">
        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Account Created</label>
              <p>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Investment Preferences</h2>
          <div className="preferences-list">
            <div className="preference-item">
              <h3>Risk Tolerance</h3>
              <select defaultValue="moderate">
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div className="preference-item">
              <h3>Investment Horizon</h3>
              <select defaultValue="medium">
                <option value="short">Short Term (&lt; 1 year)</option>
                <option value="medium">Medium Term (1-5 years)</option>
                <option value="long">Long Term (&gt; 5 years)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Account Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <h3>Notification Preferences</h3>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" defaultChecked /> Email Alerts
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Portfolio Updates
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Market News
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}