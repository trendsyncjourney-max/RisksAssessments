import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function PresenceBar({ currentUser, profile, onCallUser }) {
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: { presence: { key: currentUser.id } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.values(state).flat().filter(u => u.user_id !== currentUser.id)
        setOnlineUsers(users)
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUser.id,
            full_name: profile?.full_name || currentUser.email,
            department: profile?.department || '?'
          })
        }
      })

    return () => supabase.removeChannel(channel)
  }, [currentUser.id])

  if (onlineUsers.length === 0) return null

  return (
    <div className="presence-bar">
      <span className="presence-label">Online:</span>
      <div className="presence-users">
        {onlineUsers.map(u => (
          <div key={u.user_id} className="presence-user">
            <div className="presence-dot" />
            <span>{u.full_name}</span>
            <span style={{ color: 'var(--text-muted)' }}>({u.department})</span>
            <button className="call-btn" onClick={() => onCallUser(u)} title={`Call ${u.full_name}`}>📞</button>
          </div>
        ))}
      </div>
    </div>
  )
}
