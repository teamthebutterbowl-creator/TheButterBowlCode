import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { forgotPassword } from "../../services/authService";
import styles from "../Auth/Auth.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "Reset link sent to your email.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Account Recovery</span>
          <h1>Forgot Password</h1>
          <p>Enter your email and we'll send you a link to reset your password.</p>
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

            {message ? (
              <div>
                <p className={styles.successMessage}>{message}</p>
                <p className={styles.switchHint}>
                  Didn't get the email? Check your spam folder, or{" "}
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => setMessage("")}
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </label>

                <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            <p className={styles.switchHint}>
              Remembered your password?{" "}
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