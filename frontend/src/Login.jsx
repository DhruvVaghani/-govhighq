// // // src/Login.jsx
// import { useState } from 'react'
// import { supabase } from './supabaseClient'

// // function Login({ onLogin }) {
// //   const [email, setEmail] = useState("")

// //   const handleLogin = async () => {
// //     const { data, error } = await supabase.auth.signInWithOtp({ email })
// //     if (error) alert(error.message)
// //     else alert("Check your email for the login link!")
// //   }

// //   return (
// //     <div>
// //       <h2>Login with Email</h2>
// //       <input
// //         type="email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //         placeholder="you@example.com"
// //       />
// //       <button onClick={handleLogin}>Send Login Link</button>
// //     </div>
// //   )
  
// // }

// // export default Login


// // function Login({ onLogin }) {
// //   const [email, setEmail] = useState("")

// //   const handleLogin = async () => {
// //     const { data, error } = await supabase.auth.signInWithOtp({ email })
// //     if (error) alert(error.message)
// //     else alert("Check your email for the login link!")
// //   }

// function Login({ onLogin }) {
//   const [email, setEmail] = useState("")

//   const handleEmailLogin = async () => {
//     const { error } = await supabase.auth.signInWithOtp({ email })
//     if (error) alert(error.message)
//     else alert("✅ Check your email for the login link!")
//   }

//   const handleGoogleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google'
//     })
//     if (error) alert("OAuth login failed: " + error.message)
//     // On success, Supabase handles the redirect
//   }


//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '100vh'
//     }}>
//       <h2>Login</h2>

//       {/* Email login */}
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="you@example.com"
//         style={{
//           padding: "0.5rem",
//           marginBottom: "0.5rem",
//           width: "250px",
//           borderRadius: "4px",
//           border: "1px solid #ccc"
//         }}
//       />
//       <button
//         onClick={handleEmailLogin}
//         style={{
//           padding: "0.5rem 1rem",
//           backgroundColor: "#28a745",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           marginBottom: "1rem"
//         }}
//       >
//         Send Login Link
//       </button>

//       {/* Google OAuth login */}
//       <button
//         onClick={handleGoogleLogin}
//         style={{
//           padding: "0.5rem 1rem",
//           backgroundColor: "#4285F4",
//           color: "white",
//           border: "none",
//           borderRadius: "4px"
//         }}
//       >
//         Sign in with Google
//       </button>
//     </div>
//   )
// }

// export default Login






// src/Login.jsx
import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Login.css'
import logo from './assets/logo.png' // optional: add a logo in public/assets

function Login() {
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

  // return (
  //   <div className="login-container">
  //     <div className="login-box">
  //       {/* Optional logo */}
  //       <img src={logo} alt="App Logo" className="brand-logo" />

  //       <h2>Welcome to GovHighQ</h2> {/* Customize app name */}

  //       <input
  //         type="email"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         placeholder="you@example.com"
  //         className="login-input"
  //       />
  //       <button onClick={handleEmailLogin} className="login-button">
  //         Send Magic Link
  //       </button>

  //       <button onClick={handleGoogleLogin} className="google-button">
  //         Sign in with Google
  //       </button>
  //     </div>
  //   </div>
  // )

  return (
    <div className="login-page">
      {/* Optional blurred blobs */}
      <div className="background-shape shape1"></div>
      <div className="background-shape shape2"></div>

      <div className="login-card">
        <img src={logo} alt="App Logo" className="brand-logo" />
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
