import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import AuthPage from './components/AuthPage.jsx'
import Dashboard from './components/Dashboard.jsx'
import AirfieldDetail from './components/AirfieldDetail.jsx'
import PresenceBar from './components/PresenceBar.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import VoiceCallUI from './components/VoiceCallUI.jsx'
import EfbAuditPage from './components/EfbAuditPage.jsx'

const isEfbAuditRoute = () => window.location.pathname.startsWith('/efb_monthly_audit')

export default function App() {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [selected, setSelected] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else {
        setProfile(null)
        setSelected(null)
        setChatOpen(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }

  async function handleSignOut() {
    // reset local state immediately so UI snaps back to login
    setSelected(null)
    setChatOpen(false)
    setProfile(null)
    setSession(null)
    await supabase.auth.signOut()
  }

  function handleCallUser(targetUser) {
    window.__startVoiceCall?.(targetUser)
  }

  if (session === undefined) return <div className="loading">Loading…</div>
  if (!session) return <AuthPage />

  if (isEfbAuditRoute()) {
    return <EfbAuditPage onBack={() => { window.location.pathname = '/' }} />
  }

  return (
    <>
      {!selected ? (
        <Dashboard
          profile={profile}
          onSelect={setSelected}
          onSignOut={handleSignOut}
        />
      ) : (
        <AirfieldDetail
          airfield={selected}
          profile={profile}
          currentUser={session.user}
          onBack={() => { setSelected(null); setChatOpen(false) }}
          onSignOut={handleSignOut}
          chatOpen={chatOpen}
          onChatToggle={() => setChatOpen(o => !o)}
        />
      )}

      {session && profile && (
        <>
          {!chatOpen && (
            <PresenceBar
              currentUser={session.user}
              profile={profile}
              onCallUser={handleCallUser}
            />
          )}

          <ChatPanel
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            currentUser={session.user}
            profile={profile}
            airfieldId={selected?.id || null}
            airfieldName={selected?.name || null}
          />

          {!chatOpen && (
            <button className="chat-toggle" onClick={() => setChatOpen(o => !o)} title="Open chat">
              💬
            </button>
          )}

          <VoiceCallUI currentUser={session.user} profile={profile} />
        </>
      )}
    </>
  )
}
