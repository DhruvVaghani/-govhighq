
// // src/chatbot.jsx
// import { useState, useRef, useEffect } from 'react'
// import axios from 'axios'
// import ReactMarkdown from 'react-markdown'
// import './ChatBox.css'
// import { supabase } from './supabaseClient'
// import logo from './assets/logo.png'


// function ChatBox({ user }) {
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState([])
//   const messagesEndRef = useRef(null)

//   const sendMessage = async () => {
//     if (!input.trim()) return

//     const userMessage = input
//     setMessages(prev => [...prev, { role: "user", text: userMessage }])
//     setInput("")
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_BASE}/chat`,
//     {
//     user_input: userMessage,
//     thread_id: user.id
//       })

//       const botResponse = res.data.response
//       setMessages(prev => [...prev, { role: "bot", text: botResponse }])
//     } catch (err) {
//       console.error("Error:", err)
//       setMessages(prev => [...prev, { role: "bot", text: "❌ Failed to get response" }])
//     }
//   }

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   return (
//   <div className="chat-page">
//     <div className="chat-header">
//     <img src={logo} alt="CoSolutions Logo" className="logo-left" />
//     <button
//       onClick={() => supabase.auth.signOut()}
//       className="logout-button"
//     >
//       Logout
//     </button>
//   </div>


//     <div className="chat-messages">
//       {messages.map((msg, idx) => (
//         <div key={idx} className={`message-row ${msg.role}`}>
//           <div className={`${msg.role}-bubble`}>
//             <ReactMarkdown>{msg.text}</ReactMarkdown>
//           </div>
//         </div>
//       ))}
//       <div ref={messagesEndRef} />
//     </div>

//     <div className="chat-input-area">
//       <input
//         type="text"
//         placeholder="Ask something..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   </div>
// )

// }

// export default ChatBox
// src/chatbot.jsx
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import './ChatBox.css'
import { supabase } from './supabaseClient'
import logo from './assets/logo.png'

function getInitials(name, email) {
  const base = (name || '').trim() || (email || '').trim() || 'U'
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return 'U'
}

function Avatar({ profile, size = 36 }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback((e) => {
    e.stopPropagation()
    setOpen(v => !v)
  }, [])
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const name = profile?.name || profile?.full_name
  const email = profile?.email
  const src = profile?.avatar_url || profile?.picture

  return (
    <div className="avatar-wrap">
      <button
        className="avatar-btn"
        onClick={toggle}
        style={{ width: size, height: size }}
        aria-label="User menu"
      >
        {src ? (
          <img
            src={src}
            alt={name || email || 'User'}
            className="avatar-img"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="avatar-fallback">{getInitials(name, email)}</div>
        )}
      </button>

      {open && (
        <div className="avatar-menu">
          <div className="avatar-menu-header">
            <div className="avatar-menu-name" title={name || email}>
              {name || email || 'User'}
            </div>
            {email && <div className="avatar-menu-email" title={email}>{email}</div>}
          </div>
          <div className="avatar-sep" />
          <button
            className="avatar-menu-item"
            onClick={() => {
              // if you have a profile page, navigate here
              // window.location.href = '/profile'
            }}
          >
            Profile
          </button>
          <button
            className="avatar-menu-item"
            onClick={async () => {
              await supabase.auth.signOut()
              // Optional: redirect after sign-out
              // window.location.href = '/login'
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function ChatBox({ user }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  // Derive a consistent profile object from the `user` prop or from supabase session
  const profile = useMemo(() => {
    // user can be from supabase.auth.getUser(), often shaped as { id, email, user_metadata: {...} }
    if (!user) return undefined
    const meta = user.user_metadata || {}
    return {
      email: user.email,
      name: meta.name || meta.full_name,
      full_name: meta.full_name,
      avatar_url: meta.avatar_url,
      picture: meta.picture,
    }
  }, [user])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages(prev => [...prev, { role: "user", text: userMessage }])
    setInput("")
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/chat`, {
        user_input: userMessage,
        thread_id: user.id
      })
      const botResponse = res.data.response
      setMessages(prev => [...prev, { role: "bot", text: botResponse }])
    } catch (err) {
      console.error("Error:", err)
      setMessages(prev => [...prev, { role: "bot", text: "❌ Failed to get response" }])
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-page">
      <div className="chat-header">
        <img src={logo} alt="CoSolutions Logo" className="logo-left" />

        {/* RIGHT SIDE: Avatar instead of plain logout */}
        <div className="chat-header-right">
          {/* If you want to *also* keep the button, leave this in; otherwise remove it */}
          {/* <button onClick={() => supabase.auth.signOut()} className="logout-button">Logout</button> */}
          <Avatar profile={profile} size={36} />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.role}`}>
            <div className={`${msg.role}-bubble`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatBox
