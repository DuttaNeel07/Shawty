import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyMagicLink } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("Verifying your login link...");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("No token provided in the URL.");
      setStatus("");
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyMagicLink(token);
        // Login takes the 7-day session token
        login(data.token);
        setStatus("Success! Redirecting...");
        
        // Brief pause so the user sees success
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } catch (err) {
        setError(err.message || "Invalid or expired link. Please try logging in again.");
        setStatus("");
      }
    };

    verify();
  }, [token, login, navigate]);

  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="login-brand">
          <span className="login-logo">pb</span>
          <h1>Verifying Link</h1>
        </div>

        {status && (
          <div className="loading-state" style={{ padding: '24px' }}>
            <div className="spinner" />
            <p>{status}</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon" style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--red)' }}>⚠️</div>
            <p className="login-error" style={{ marginBottom: '24px' }}>{error}</p>
            <button className="btn btn-primary btn-full" onClick={() => navigate("/login")}>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;
