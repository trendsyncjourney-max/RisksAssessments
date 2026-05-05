import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ChatPanel({ open, onClose, currentUser, profile, airfieldId, airfieldName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [profiles, setProfiles] = useState({})
  const bottomRef = useRef(null)

  const channelKey = airfieldId || 'general'

  useEffect(() => {
    if (!open) return
    loadMessages()
    const channel = supabase.channel(`chat:${channelKey}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: airfieldId ? `airfield_id=eq.${airfieldId}` : undefined
      }, ({ new: msg }) => {
        setMessages(prev => [...prev, msg])
        loadProfile(msg.sender_id)
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [open, channelKey])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    const q = supabase.from('chat_messages').select('*').order('created_at')
    if (airfieldId) q.eq('airfield_id', airfieldId)
    else q.is('airfield_id', null)
    const { data } = await q
    if (data) {
      setMessages(data)
      const ids = [...new Set(data.map(m => m.sender_id))]
      ids.forEach(loadProfile)
    }
  }

  async function loadProfile(id) {
    if (profiles[id]) return
    const { data } = await supabase.from('profiles').select('full_name, department').eq('id', id).single()
    if (data) setProfiles(prev => ({ ...prev, [id]: data }))
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return
    const msg = {
      sender_id: currentUser.id,
      message: input.trim(),
      airfield_id: airfieldId || null
    }
    setInput('')
    await supabase.from('chat_messages').insert(msg)
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`chat-panel ${open ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>💬 {airfieldName ? `Chat — ${airfieldName}` : 'General Chat'}</h3>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && <div className="empty" style={{ padding: 20, fontSize: 12 }}>No messages yet. Say hello!</div>}
        {messages.map(msg => {
          const isOwn = msg.sender_id === currentUser.id
          const sender = isOwn ? profile : profiles[msg.sender_id]
          return (
            <div key={msg.id} className={`chat-msg ${isOwn ? 'own' : 'other'}`}>
              {!isOwn && <div className="chat-meta">{sender?.full_name || '?'} · {sender?.department}</div>}
              <div className="chat-bubble">{msg.message}</div>
              <div className="chat-meta">{formatTime(msg.created_at)}</div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-row" onSubmit={sendMessage}>
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <button className="chat-send" type="submit">Send</button>
      </form>
    </div>
  )
}
