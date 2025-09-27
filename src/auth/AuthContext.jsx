/**
 * AuthContext manages the user's authentication token and exposes register/login/logout.
 */
import { createContext, useContext, useState } from "react";

const API = import.meta.env.VITE_API ?? "https://fitnesstrac-kr.herokuapp.com/api";
console.log("API base is:", API);

const AuthContext = createContext(null);

// Safe parser: handles empty/non-JSON bodies and throws useful errors
async function parseMaybeJson(response) {
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* ignore non-JSON */ }

  if (!response.ok) {
    const msg = data?.message || data?.error || `${response.status} ${response.statusText}`;
    throw new Error(msg);
  }
  return data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const register = async (credentials) => {
    const res = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await parseMaybeJson(res);
    if (!data?.token) throw new Error("No token returned from server.");
    setToken(data.token);
  };

  const login = async (credentials) => {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await parseMaybeJson(res);
    if (!data?.token) throw new Error("No token returned from server.");
    setToken(data.token);
  };

  const logout = () => setToken(null);

  const value = { token, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
