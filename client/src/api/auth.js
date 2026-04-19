export const loginUser = async (email) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Returns { message: "Email sent" } instead of token
  return data;
};

export const verifyMagicLink = async (token) => {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Verification failed');
  }

  // Returns { token: "session_token" }
  return data;
};