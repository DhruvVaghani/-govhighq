// // src/chatbot.jsx
// import { useState } from 'react'
// import axios from 'axios'
// import ReactMarkdown from 'react-markdown'
// import './ChatBox.css'


// function ChatBox({ user }) {
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState([])

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     try {
//       const res = await axios.post("http://localhost:8000/chat", {
//         user_input: input,
//         thread_id: user.id
//       })

//       const response = res.data.response
//        console.log("Full response from backend:", response);

//       setMessages(prev => [...prev, { user: input, bot: response }])
//       setInput("")
//     } catch (err) {
//       console.error("Error:", err)
//       setMessages(prev => [...prev, { user: input, bot: "❌ Failed to get response" }])
//     }
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-messages">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="message">
//             <div className="user-message">
//               <strong>You:</strong> {msg.user}
//             </div>
//             <div className="bot-message">
//               <strong>Bot:</strong> <ReactMarkdown>{msg.bot}</ReactMarkdown>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask something..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   )
// }

// export default ChatBox


// src/chatbot.jsx
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import './ChatBox.css'
import { supabase } from './supabaseClient'
import logo from './assets/logo.png'


function ChatBox({ user }) {
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

  return (
  <div className="chat-page">
    <div className="chat-header">
    <img src={logo} alt="CoSolutions Logo" className="logo-left" />
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
