import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

const DEPARTMENTS = ['ENG', 'FSS', 'GOP', 'MGT', 'SAFE', 'ADMIN']

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [department, setDepartment] = useState('FSS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    if (!fullName.trim()) { setError('Full name is required'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin
      }
    })
    if (error) { setError(error.message); setLoading(false); return }

    // set department in app_metadata via service-role would need edge function
    // for now store in profile after signup via trigger — update dept directly
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('profiles').update({ department, full_name: fullName }).eq('id', session.user.id)
    }
    setError('Check your email to confirm your account, then log in.')
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">RisksAssessments</div>
        <div className="auth-sub">DHL Cargo · Airfield Assessment System</div>

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            {error && <div className="auth-err">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="John Smith" />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" />
            </div>
            <div className="auth-field">
              <label>Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {error && <div className="auth-err">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('signup'); setError('') }}>Sign Up</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError('') }}>Sign In</button></>
          )}
        </div>
      </div>
    </div>
  )
}
