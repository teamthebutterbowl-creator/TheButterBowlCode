import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import styles from './Auth.module.css';
import { API_BASE } from '../../config/api';
import { useAuth } from '../../context/AuthContext';




/** Which form is visible: "login" or "register" */
const MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
};

/** Starting values for both forms — keeps inputs controlled in React */
const initialLogin = { email: '', password: '' };
const initialRegister = { name: '', email: '', phone: '', password: '' };

// 🌟 FIXED: Removed the global "const { login } = useAuth();" from here!

/**
 * Reusable password field with show/hide eye button.
 * Used in both Login and Register forms.
 */
function PasswordField({
  id,
  label,
  name,
  value,
  onChange,
  error,
  showPassword,
  onToggleVisibility,
}) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <div className={styles.passwordWrap}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={name === 'password' ? 'current-password' : 'new-password'}
          className={error ? styles.inputError : ''}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={onToggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

export default function Auth() {
  // Navigate hook for redirecting after login/register
  const navigate = useNavigate();
  
  // 🌟 FIXED: Placed useAuth safely inside the component body where it belongs
  const { login } = useAuth();

  const [mode, setMode] = useState(MODES.LOGIN);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  /** Update login fields when user types */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setLoginErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  /** Update register fields when user types */
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    setRegisterErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const isEmpty = (value) => !String(value).trim();

  const validateLogin = () => {
    const errors = {};
    if(isEmpty(loginForm.email)){
      errors.email="Email is required";
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)){
      errors.email="Please enter a valid email address";
    }
    if(isEmpty(loginForm.password)){
      errors.password="Passowrd is required";
    }else if(loginForm.password.length<8){
      errors.password="password must be at least 8 character ";
    }
    return errors;


  };

  const validateRegister = () => {
    const errors = {};
    if (isEmpty(registerForm.name)) {
      errors.name = 'Name is required';
    }
    if (isEmpty(registerForm.email))
      {
        errors.email = 'Email is required';
      }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)){
         errors.email = 'Please enter a valid email address';
      }
    if (isEmpty(registerForm.phone)){
    errors.phone = 'Phone is required';}
    else if(!/^[6-9]\d{9}$/.test(registerForm.phone)){
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (isEmpty(registerForm.password)) 
      {errors.password = 'Password is required';
      }else if(registerForm.password.length<8){
        errors.password="Password must be at least 8 characters";
      }
    return errors;
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setApiError('');
    setLoginErrors({});
    setRegisterErrors({});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setApiError('');

    try {
     
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await response.json();
  

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('butterBowlToken', data.token);
      localStorage.setItem('butterBowlUser', JSON.stringify(data.user));

     
      login(data.token, data.user);
      navigate('/');

    } catch (error) {
    
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRegister();
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setApiError('');

    try {
      
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          phone: registerForm.phone,
        }),
      });

      const data = await response.json();
      

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('butterBowlToken', data.token);
      localStorage.setItem('butterBowlUser', JSON.stringify(data.user));

     
      login(data.token, data.user); // Make sure to log them in directly after registering too!
      navigate('/');

    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === MODES.LOGIN;

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Welcome</span>
          <h1>{isLogin ? 'Sign In' : 'Create Account'}</h1>
          <p>
            {isLogin
              ? 'Sign in to track orders and enjoy a personalised experience.'
              : 'Join The Butter Bowl family — quick, easy, and secure.'}
          </p>
        </div>
      </header>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.card}>
            <div className={styles.tabs} role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                role="tab"
                aria-selected={isLogin}
                className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`}
                onClick={() => switchMode(MODES.LOGIN)}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isLogin}
                className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`}
                onClick={() => switchMode(MODES.REGISTER)}
              >
                Register
              </button>
            </div>

            {apiError && (
              <p className={styles.error} role="alert">
                ⚠️ {apiError}
              </p>
            )}

            {isLogin ? (
              <form className={styles.form} onSubmit={handleLoginSubmit} noValidate aria-label="Login form">
                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    autoComplete="email"
                    className={loginErrors.email ? styles.inputError : ''}
                    aria-invalid={Boolean(loginErrors.email)}
                  />
                  {loginErrors.email && <span className={styles.error} role="alert">{loginErrors.email}</span>}
                </label>

                <PasswordField
                  id="login-password"
                  label="Password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  error={loginErrors.password}
                  showPassword={showLoginPassword}
                  onToggleVisibility={() => setShowLoginPassword((v) => !v)}
                />
                <div className={styles.forgotPasswordRow}>
  <Link to="/forgot-password" className={styles.linkBtn}>
    Forgot Password?
  </Link>
</div>

                <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate aria-label="Register form">
                <label className={styles.field}>
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    autoComplete="name"
                    className={registerErrors.name ? styles.inputError : ''}
                    aria-invalid={Boolean(registerErrors.name)}
                  />
                  {registerErrors.name && <span className={styles.error} role="alert">{registerErrors.name}</span>}
                </label>

                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    autoComplete="email"
                    className={registerErrors.email ? styles.inputError : ''}
                    aria-invalid={Boolean(registerErrors.email)}
                  />
                  {registerErrors.email && <span className={styles.error} role="alert">{registerErrors.email}</span>}
                </label>

                <label className={styles.field}>
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    autoComplete="tel"
                    className={registerErrors.phone ? styles.inputError : ''}
                    aria-invalid={Boolean(registerErrors.phone)}
                  />
                  {registerErrors.phone && <span className={styles.error} role="alert">{registerErrors.phone}</span>}
                </label>

                <PasswordField
                  id="register-password"
                  label="Password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  error={registerErrors.password}
                  showPassword={showRegisterPassword}
                  onToggleVisibility={() => setShowRegisterPassword((v) => !v)}
                />

                <Button type="submit" variant="primary" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <p className={styles.switchHint}>
              {isLogin ? (
                <>
                  New here?{' '}
                  <button type="button" className={styles.linkBtn} onClick={() => switchMode(MODES.REGISTER)}>
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" className={styles.linkBtn} onClick={() => switchMode(MODES.LOGIN)}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}