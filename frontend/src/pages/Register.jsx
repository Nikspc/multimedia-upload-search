import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(register({ name, email, password })).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h1 className="auth__title">Create your account</h1>
          <p className="auth__subtitle">Upload images, videos, audio, and PDFs securely.</p>
        </div>

        {error ? <div className="auth__alert">{String(error)}</div> : null}

        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__label">
            Name
            <input
              className="auth__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
              minLength={2}
            />
          </label>

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
              placeholder="Min 6 characters"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>

          <button className="auth__button" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="auth__footer">
          <span>Already have an account?</span>
          <Link className="auth__link" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}