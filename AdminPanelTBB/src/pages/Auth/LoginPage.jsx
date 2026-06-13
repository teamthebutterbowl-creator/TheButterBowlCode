import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import FormInput from '../../components/common/Input/FormInput';
import Button from '../../components/common/Button/Button';
import './AuthPages.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
  
    setError("");
  
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
  
    setIsLoading(true);
  
  
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }
  
      if (data.user?.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        setIsLoading(false);
        return;
      }
  
      
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
     
      
  
      navigate("/dashboard");
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
              <circle cx="200" cy="150" r="40" fill="rgba(255, 75, 62, 0.2)"/>
              <path d="M160 220 L240 220 L235 280 L165 280 Z" fill="rgba(255, 75, 62, 0.15)"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <p>{error}</p>
              </div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />

            <div className="password-field-wrapper">
              <FormInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-options">
             
           
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button
              variant="primary"
              size="large"
              type="submit"
              disabled={isLoading}
              style={{ width: '100%' }}
              icon={isLoading ? null : LogIn}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <a href="mailto:admin@example.com">Contact administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
