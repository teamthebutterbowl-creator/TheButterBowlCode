import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import FormInput from '../../components/common/Input/FormInput';
import Button from '../../components/common/Button/Button';
import './AuthPages.css';
const API_BASE=import.meta.env.VITE_API_BASE_URL;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const[error,setError]=useState("");
 
  
 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!email) {
    setError("Please enter your email address.");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      return;
    }

    setIsSubmitted(true);
  } catch (err) {
    setError("Connection error. Please check your network.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="auth-layout">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-logo">R</div>
          <h1>RestaurantMaster</h1>
          <p>Enterprise Admin Panel</p>
        </div>
        <div className="auth-illustration">
          <div className="illustration-placeholder">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" fill="rgba(255, 75, 62, 0.1)" stroke="rgba(255, 75, 62, 0.2)" strokeWidth="2"/>
              <path d="M150 180 L250 180 Q260 180 260 190 L260 260 Q260 270 250 270 L150 270 Q140 270 140 260 L140 190 Q140 180 150 180 Z" fill="none" stroke="rgba(255, 75, 62, 0.2)" strokeWidth="2"/>
              <path d="M180 200 L220 200" stroke="rgba(255, 75, 62, 0.2)" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          {!isSubmitted ? (
            <>
              <div className="auth-header">
                <h2>Reset your password</h2>
                <p>Enter your email address and we'll send you a link to reset your password</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <FormInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />

                <Button
                  variant="primary"
                  size="large"
                  type="submit"
                  disabled={isLoading}
                  style={{ width: '100%' }}
                  icon={isLoading ? null : Mail}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="auth-footer">
                <Link to="/login" className="back-link">
                  <ArrowLeft size={18} />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="auth-success">
                <div className="success-icon">
                  <CheckCircle size={64} />
                </div>
                <h2>Check your email</h2>
                <p>We've sent a password reset link to <strong>{email}</strong></p>
                <p className="success-subtext">Click the link in the email to reset your password. The link will expire in 24 hours.</p>
              </div>

              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/login')}
                style={{ width: '100%' }}
              >
                Back to Login
              </Button>

              <div className="auth-footer">
                <p>
                  Didn't receive the email?{' '}
                  <button
                    type="button"
                    className="resend-link"
                    onClick={() => {
                      setEmail('');
                      setIsSubmitted(false);
                    }}
                  >
                    Try again
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
