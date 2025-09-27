import { useState } from "react";
import { useAuth } from "./AuthContext";
import { usePage } from "../layout/PageContext";

/** A form that allows users to log in to an existing account */
export default function Login() {
  const { login } = useAuth();
  const { setPage } = usePage();
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const username = fd.get("username");
    const password = fd.get("password");

    try {
      await login({ username, password });
      setPage("activities");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Log in to your account</h1>
      <form onSubmit={onSubmit}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button>Log in</button>
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
      </form>
      <a onClick={() => setPage("register")}>Don’t have an account? Register here.</a>
    </>
  );
}
