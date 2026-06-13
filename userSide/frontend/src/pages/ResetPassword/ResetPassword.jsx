import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { resetPassword } from "../../services/authService";
import styles from "../Auth/Auth.module.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/auth"), 2500);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Account Recovery</span>
          <h1>Reset Password</h1>
          <p>Enter a new password for your account.</p>
        </div>
      </header>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.card}>
            {error && (
              <p className={styles.error} role="alert">
                ⚠️ {error}
              </p>
            )}

            {success ? (
              <div>
                <p className={styles.successMessage}>
                  Password reset successful! Redirecting to sign in...
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label className={styles.field} htmlFor="new-password">
                  <span>New Password</span>
                  <div className={styles.passwordWrap}>
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <label className={styles.field} htmlFor="confirm-password">
                  <span>Confirm New Password</span>
                  <div className={styles.passwordWrap}>
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </label>

                <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            <p className={styles.switchHint}>
              <Link to="/auth" className={styles.linkBtn}>
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}