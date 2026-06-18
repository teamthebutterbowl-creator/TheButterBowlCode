import { useState } from 'react';
import { brand } from '../../data/brand';
import Button from '../../components/Button/Button';
import styles from './Contact.module.css';
import { API_BASE } from '../../config/api';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      setSubmitted(true);
    } catch (error) {
      console.error('Contact form error:', error.message);
      // optional: error state dikha sakte ho
    }
  };
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1>Contact Us</h1>
          <p>
            Have a question, feedback, or a bulk order request? We would love
            to hear from you.
          </p>
        </div>
      </header>

      <section className="section">
        <div className={`container ${styles.grid}`}>

          {/* Left: contact info */}
          <div className={styles.info}>
            <div className={styles.infoBlock}>
              <h3>Phone</h3>
              <a href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>
            </div>
            <div className={styles.infoBlock}>
              <h3>Email</h3>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </div>
            <div className={styles.infoBlock}>
              <h3>Address</h3>
              <p>{brand.address}</p>
            </div>
            <div className={styles.infoBlock}>
              <h3>Working Hours</h3>
              <p>Mon – Sun : {brand.hours.weekdays}</p>
              {/* <p>Fri – Sun: {brand.hours.weekend}</p> */}
            </div>
          </div>

          {/* Right: form or success */}
          {submitted ? (
            <div className={styles.success}>
              <h2>Thank you! 🎉</h2>
              <p>
                Your message has been received. Our team will get back to you
                shortly.
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
               
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
              
                />
              </label>

              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your question, feedback, or bulk order request..."
                />
              </label>

              {/* API error */}
              {apiError && (
                <p style={{ color: 'red', fontSize: '0.875rem' }}>⚠️ {apiError}</p>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>

            </form>
          )}

        </div>
      </section>
    </>
  );
}