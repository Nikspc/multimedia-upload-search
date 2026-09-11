import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      // redux already holds error; keep UI stable
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__subtitle">Login to upload and search your media.</p>
        </div>

        {error ? <div className="auth__alert">{String(error)}</div> : null}

        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__label">
            Email
            <input
              className="auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth__label">
            Password
            <input
              className="auth__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="auth__button" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth__footer">
          <span>Don’t have an account?</span>
          <Link className="auth__link" to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}