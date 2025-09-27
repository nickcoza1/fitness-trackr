import { useState } from "react";
import { useAuth } from "./AuthContext";
import { usePage } from "../layout/PageContext";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const { setPage } = usePage();
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const username = fd.get("username");
    const password = fd.get("password");

    try {
      await register({ username, password });
      setPage("activities");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Register for an account</h1>
      <form onSubmit={onSubmit}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button>Register</button>
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
      </form>
      <a onClick={() => setPage("login")}>Already have an account? Log in here.</a>
    </>
  );
}
