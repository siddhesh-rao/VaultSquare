import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from "../components/ui/Alert";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="page-shell flex justify-center">
      <div className="card w-full max-w-lg p-6">
        <h1 className="font-display text-3xl text-white">Create your account</h1>
        <p className="mt-2 text-slate-400">Start buying products and reserving rentals with wallet-backed identity.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Alert type="error" message={error} />
          <input
            className="input"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
