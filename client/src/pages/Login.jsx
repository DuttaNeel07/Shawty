import { useState } from "react";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email);
      setEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo">pb</span>
          <h1>pointblank.club</h1>
          <p className="login-subtitle">URL Shortener — Members Only</p>
        </div>

        {emailSent ? (
          <div className="login-success-state">
            <div className="success-icon" style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--green)' }}>✉️</div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Check your email</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We sent a magic link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. 
              Click the link to sign in.
            </p>
            <button className="btn btn-ghost" onClick={() => setEmailSent(false)}>
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Club Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@pointblank.club"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? "Sending link..." : "Send Magic Link"}
            </button>
          </form>
        )}

        {error && <p className="login-error">{error}</p>}

        {!emailSent && (
          <p className="login-footer">
            Access is verified against your Linear workspace membership.
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;