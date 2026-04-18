import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';

  const [mode, setMode] = useState(location.state?.mode || 'login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await register({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
        });
      }
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <img src="/images/logo-3sixty.png" alt="3Sixty Branding" className="auth-logo-img" />
        </Link>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>
            Sign In
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          {/* Register-only fields */}
          {mode === 'register' && (
            <>
              <div className="auth-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" value={form.firstName} onChange={set('firstName')} required placeholder="First name" />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" value={form.lastName} onChange={set('lastName')} required placeholder="Last name" />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={form.phone} onChange={set('phone')} required placeholder="e.g. 082 555 0000" />
              </div>
            </>
          )}

          {/* Shared fields */}
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" value={form.password} onChange={set('password')} required placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required placeholder="Repeat password" autoComplete="new-password" />
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {mode === 'login' && (
            <p className="auth-switch">
              Don't have an account?{' '}
              <button type="button" onClick={() => { setMode('register'); setError(''); }}>Create one</button>
            </p>
          )}
          {mode === 'register' && (
            <p className="auth-switch">
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
            </p>
          )}
        </form>

        <p className="auth-guest">
          <Link to={returnTo}>Continue as guest →</Link>
        </p>
      </div>
    </main>
  );
}

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default Auth;
