// src/App.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import ChatBox from './chatbot'
import LogoutButton from './LogoutButton'  // ✅ Import it
import logo from './assets/logo.png'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }, [])

  // THEME: persist theme in localStorage and apply a body class
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme')
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme')
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  // DELETE BELOW THIS LINE AFTER TESTING
  // Dev shortcut: allow bypassing the login screen without changing auth.
  // Usage:
  // - Add ?skipLogin=1 to the URL, e.g. http://localhost:5174/?skipLogin=1
  // - OR set localStorage.setItem('forceChat','1') in the browser console
  // - OR set the env var VITE_FORCE_CHAT=true for a more persistent dev mode
  // When enabled we render ChatBox with a small dev user object.
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const forceFromStorage = typeof window !== 'undefined' && window.localStorage?.getItem('forceChat') === '1'
  const forceFromEnv = import.meta.env.VITE_FORCE_CHAT === 'true'
  const forceChat = forceFromUrl || forceFromStorage || forceFromEnv

  if (forceChat) {
    const devUser = { id: 'dev-user', email: 'dev@example.com' }
    return (
      <div>
        <ChatBox user={devUser} theme={theme} toggleTheme={toggleTheme} />
      </div>
    )
  }
  // END DELETE 

  // Render login or chat, with theme toggle always present
  const content = !user ? <Login theme={theme} toggleTheme={toggleTheme} /> : <ChatBox user={user} theme={theme} toggleTheme={toggleTheme} />

  return (
    <div>
      {content}
    </div>
  )
}

export default App
// ...existing code...