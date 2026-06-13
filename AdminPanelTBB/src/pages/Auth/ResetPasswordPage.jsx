import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import FormInput from '../../components/common/Input/FormInput';
import Button from '../../components/common/Button/Button';
import '../Auth/AuthPages.css';
const API_BASE=import.meta.env.VITE_API_BASE_URL

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Password strength validation
  const validatePasswordStrength = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const strength = {
      requirements,
      metRequirements,
      isStrong: Object.values(requirements).every(Boolean),
    };

    return strength;
  };

  const passwordStrength = validatePasswordStrength(newPassword);

  // Form validation
  const isPasswordsMatching = newPassword && confirmPassword && newPassword === confirmPassword;
  const isFormValid = newPassword && confirmPassword && passwordStrength.isStrong && isPasswordsMatching;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('isFormValid:', isFormValid);
    console.log('newPassword:', newPassword);
    console.log('confirmPassword:', confirmPassword);
    console.log('passwordStrength:', passwordStrength);

    // Validation
    if (!isFormValid) {
      setError('Please ensure all password requirements are met and passwords match.');
      return;
    }

    setIsLoading(true);

try {
  const res = await fetch(
    `${API_BASE}/api/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setError(data.message || "Failed to reset password.");
    return;
  }

  setIsSubmitted(true);
} catch (err) {
  setError("Connection error. Please try again.");
} finally {
  setIsLoading(false);
}
  };

  // Requirement item component
  const RequirementItem = ({ met, text }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`requirement-item ${met ? 'met' : ''}`}
    >
      <div className="requirement-check">
        {met ? (
          <CheckCircle size={16} />
        ) : (
          <div className="requirement-circle" />
        )}
      </div>
      <span>{text}</span>
    </motion.div>
  );

  // Success state
  if (isSubmitted) {
    return (
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-branding">
              <div className="auth-logo">R</div>
              <h1>RestaurantMaster</h1>
              <p>Enterprise Admin Panel</p>
            </div>
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='%23031633' width='300' height='300'/%3E%3C/svg%3E" alt="decorative" />
          </div>
        </div>

        <div className="auth-right">
          <motion.div
            className="auth-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="auth-success">
              <motion.div
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle size={64} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2>Password Updated Successfully</h2>
                <p>Your password has been reset successfully. You can now sign in using your new password.</p>
              </motion.div>

              <Link to="/login">
                <Button variant="primary" size="medium" fullWidth>
                  Go To Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-branding">
            <div className="auth-logo">R</div>
            <h1>RestaurantMaster</h1>
            <p>Enterprise Admin Panel</p>
          </div>
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='%23031633' width='300' height='300'/%3E%3C/svg%3E" alt="decorative" />
        </div>
      </div>

      <div className="auth-right">
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="auth-header">
            <h2>Reset Your Password</h2>
            <p>Create a new secure password for your account</p>
          </div>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group">
              <FormInput
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <motion.div
                className="password-requirements"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="requirements-header">
                  <span>Password Requirements:</span>
                  <span className={`strength-indicator ${passwordStrength.isStrong ? 'strong' : 'weak'}`}>
                    {passwordStrength.metRequirements}/5 met
                  </span>
                </div>

                <div className="requirements-list">
                  <RequirementItem
                    met={passwordStrength.requirements.minLength}
                    text="Minimum 8 characters"
                  />
                  <RequirementItem
                    met={passwordStrength.requirements.hasUppercase}
                    text="One uppercase letter"
                  />
                  <RequirementItem
                    met={passwordStrength.requirements.hasLowercase}
                    text="One lowercase letter"
                  />
                  <RequirementItem
                    met={passwordStrength.requirements.hasNumber}
                    text="One number"
                  />
                  <RequirementItem
                    met={passwordStrength.requirements.hasSpecial}
                    text="One special character"
                  />
                </div>
              </motion.div>
            )}

            {/* Confirm Password */}
            <div className="form-group">
              <FormInput
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Match Validation */}
            {confirmPassword && (
              <motion.div
                className={`password-match-status ${isPasswordsMatching ? 'match' : 'mismatch'}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isPasswordsMatching ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <span className="mismatch-icon">✕</span>
                    <span>Passwords do not match</span>
                  </>
                )}
              </motion.div>
            )}
            {!isFormValid && (newPassword || confirmPassword) && (
  <p className="auth-error" style={{marginTop: '8px'}}>
    Please ensure all password requirements are met and passwords match.
  </p>
)}

            {/* Reset Password Button */}
            <Button
              variant="primary"
              size="medium"
              fullWidth
              disabled={!isFormValid || isLoading}
              type="submit"
              icon={ShieldCheck}
              iconPosition="left"
          
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          {/* Back to Login */}
          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
