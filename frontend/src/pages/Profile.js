import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page container">
      <h1 className="page-title horror-title">Profile</h1>
      <div className="profile-card">
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  );
};

export default Profile;
