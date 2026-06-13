

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';
import { API_BASE } from '../../config/api';
export default function Profile() {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, logout, login } = useAuth();

  // Profile data from API
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('Profile: Not logged in, redirecting to /auth');
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

  // Fetch user profile from backend
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchProfile = async () => {
      console.log('Profile: Fetching user profile...');
      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Profile: API response:', data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load profile');
        }

        setProfile(data.data);
        // Pre-fill edit form
        setEditForm({
          name: data.data.name || '',
          phone: data.data.phone || '',
        });
        console.log('Profile: Loaded profile for:', data.data.name);

      } catch (error) {
        console.log('Profile: Error fetching profile:', error.message);
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, token]);

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditSuccess('');
  };

  // Format date nicely
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  // Handle logout
  const handleLogout = () => {
    console.log('Profile: Logging out...');
    logout();
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <section className={styles.page}>
        <div className="container">
          <div className={styles.loading}>
            <p>Loading your profile...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (apiError) {
    return (
      <section className={styles.page}>
        <div className="container">
          <div className={styles.error}>
            <p>⚠️ {apiError}</p>
            <button onClick={() => navigate('/')} className={styles.homeBtn}>
              Go to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">My Account</span>
          <h1>My Profile</h1>
          <p>Manage your account and view your order history.</p>
        </div>
      </header>

      <section className={`section ${styles.page}`}>
        <div className="container">
          <div className={styles.wrapper}>

            {/* Profile card */}
            <div className={styles.profileCard}>

              {/* Avatar + name */}
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  {/* Show first letter of name as avatar */}
                  {profile?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className={styles.userName}>{profile?.name}</h2>
                  <p className={styles.userRole}>{profile?.role || 'Customer'}</p>
                </div>
              </div>

              {/* Profile details */}
              <div className={styles.detailsSection}>
                <h3 className={styles.sectionTitle}>Account Details</h3>

                <div className={styles.detailGrid}>
                  <div className={styles.detailBox}>
                    <p className={styles.detailLabel}>Full Name</p>
                    <p className={styles.detailValue}>{profile?.name}</p>
                  </div>
                  <div className={styles.detailBox}>
                    <p className={styles.detailLabel}>Email</p>
                    <p className={styles.detailValue}>{profile?.email}</p>
                  </div>
                  <div className={styles.detailBox}>
                    <p className={styles.detailLabel}>Phone</p>
                    <p className={styles.detailValue}>{profile?.phone || 'Not added'}</p>
                  </div>
                  <div className={styles.detailBox}>
                    <p className={styles.detailLabel}>Member Since</p>
                    <p className={styles.detailValue}>
                      {profile?.createdAt ? formatDate(profile.createdAt) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className={styles.actions}>
                <button
                  className={styles.ordersBtn}
                  onClick={() => navigate('/my-orders')}
                >
                  📦 My Orders
                </button>
                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}