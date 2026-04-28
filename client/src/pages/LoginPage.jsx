import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from "../components/ui/Alert";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await login(form);
      navigate(response.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-shell flex justify-center">
      <div className="card w-full max-w-lg p-6">
        <h1 className="font-display text-3xl text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">Log in to manage purchases, rentals, and your wallet.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Alert type="error" message={error} />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Need an account?{" "}
          <Link to="/register" className="text-brand-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
