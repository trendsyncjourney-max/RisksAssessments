import { useState, useEffect, useRef } from 'react'
import { VoiceCall, subscribeIncomingCalls } from '../lib/webrtc.js'

export default function VoiceCallUI({ currentUser, profile }) {
  const [callState, setCallState] = useState(null) // null | 'calling' | 'incoming' | 'connected' | 'ended'
  const [remoteUser, setRemoteUser] = useState(null)
  const [incomingSignal, setIncomingSignal] = useState(null)
  const [muted, setMuted] = useState(false)
  const callRef = useRef(null)

  useEffect(() => {
    const sub = subscribeIncomingCalls(currentUser.id, signal => {
      setIncomingSignal(signal)
      setRemoteUser({ user_id: signal.from_user, full_name: signal.payload?.caller_name || 'Unknown' })
      setCallState('incoming')
    })
    return () => sub.unsubscribe?.()
  }, [currentUser.id])

  window.__startVoiceCall = async (targetUser) => {
    setRemoteUser(targetUser)
    const vc = new VoiceCall(currentUser.id, targetUser.user_id, s => {
      setCallState(s === 'ended' ? null : s)
    })
    callRef.current = vc
    await vc.startCall()
    setCallState('calling')
  }

  async function acceptCall() {
    if (!incomingSignal) return
    const vc = new VoiceCall(currentUser.id, incomingSignal.from_user, s => {
      setCallState(s === 'ended' ? null : s)
    })
    callRef.current = vc
    await vc.answerCall(incomingSignal.payload)
    setCallState('connected')
  }

  function declineCall() {
    setCallState(null)
    setRemoteUser(null)
    setIncomingSignal(null)
  }

  async function hangup() {
    if (callRef.current) await callRef.current.hangup()
    callRef.current = null
    setCallState(null)
    setRemoteUser(null)
  }

  function toggleMute() {
    if (callRef.current) {
      const m = callRef.current.toggleMute()
      setMuted(m)
    }
  }

  if (!callState) return null

  const initials = (remoteUser?.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="voice-overlay">
      <div className="voice-card">
        <div className={`voice-avatar ${callState === 'connected' ? 'speaking-ring' : ''}`}>{initials}</div>
        <div className="voice-name">{remoteUser?.full_name || 'Unknown'}</div>
        <div className="voice-status">
          {callState === 'calling' && 'Calling…'}
          {callState === 'incoming' && 'Incoming call'}
          {callState === 'connected' && 'Connected'}
        </div>
        <div className="voice-actions">
          {callState === 'incoming' && (
            <>
              <button className="voice-btn accept" onClick={acceptCall} title="Accept">✓</button>
              <button className="voice-btn decline" onClick={declineCall} title="Decline">✕</button>
            </>
          )}
          {(callState === 'calling' || callState === 'connected') && (
            <>
              <button className={`voice-btn mute`} onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
                {muted ? '🔇' : '🎤'}
              </button>
              <button className="voice-btn hangup" onClick={hangup} title="Hang up">✕</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
