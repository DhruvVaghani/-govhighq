// src/Login.jsx
import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Login.css'
import logo from './assets/logo.png' // optional: add a logo in public/assets
import logoLight from './assets/logolight.png'

function Login({ theme, toggleTheme }) {
  const [email, setEmail] = useState("")

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert("✅ Check your email for the login link!")
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if (error) alert("OAuth login failed: " + error.message)
  }

  return (
    <div className="login-page">
      <div className="top-controls">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      {/* Optional blurred blobs */}
      <div className="background-shape shape1"></div>
      <div className="background-shape shape2"></div>

      <div className="login-card">
        <img src={theme === 'dark' ? logoLight : logo} alt="App Logo" className="brand-logo" />
        <h2>Welcome to GovHighQ</h2>
        <input
          type="email"
          className="login-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleEmailLogin} className="login-button">
          Send Link to Email
        </button>

        <button onClick={handleGoogleLogin} className="google-button">
          Sign in with Google
        </button>
      </div>
    </div>
  )


}

export default Login
