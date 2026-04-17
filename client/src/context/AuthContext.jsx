import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('pb_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pb_token');
    return saved ? decodeJWT(saved) : null;
  });

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
        localStorage.setItem('pb_token', token);
      } else {
        logout();
      }
    }
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem('pb_token', jwtToken);
    setToken(jwtToken);
    setUser(decodeJWT(jwtToken));
  };

  const logout = () => {
    localStorage.removeItem('pb_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);