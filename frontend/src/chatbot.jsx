import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import './ChatBox.css'
import { supabase } from './supabaseClient'
import logo from './assets/logo.png'
import logoLight from './assets/logolight.png'


function ChatBox({ user, theme, toggleTheme }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages(prev => [...prev, { role: "user", text: userMessage }])
    setInput("")
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/chat`,
    {
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

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const logoToShow = theme === 'dark' ? logoLight : logo

  return (
  <div className="chat-page">
    <div className="chat-header">
      <div className="header-left">
        <img src={logoToShow} alt="CoSolutions Logo" className="logo-left" />
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <button
        onClick={() => supabase.auth.signOut()}
        className="logout-button"
      >
        Logout
      </button>
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
