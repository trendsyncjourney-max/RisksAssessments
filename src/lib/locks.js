import { supabase } from './supabase.js'

export async function acquireLock(airfieldId, department, userId) {
  // clean expired locks first
  await supabase.rpc('clean_expired_locks')

  const { data: existing } = await supabase
    .from('record_locks')
    .select('*, profiles(full_name, department)')
    .eq('airfield_id', airfieldId)
    .eq('department', department)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (existing) {
    if (existing.locked_by === userId) {
      // extend own lock
      await supabase.from('record_locks').update({
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      }).eq('id', existing.id)
      return { acquired: true, lock: existing }
    }
    return { acquired: false, lock: existing }
  }

  const { data, error } = await supabase.from('record_locks').insert({
    airfield_id: airfieldId,
    department,
    locked_by: userId,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  }).select('*, profiles(full_name)').single()

  if (error) return { acquired: false, lock: null }
  return { acquired: true, lock: data }
}

export async function releaseLock(airfieldId, department, userId) {
  await supabase.from('record_locks')
    .delete()
    .eq('airfield_id', airfieldId)
    .eq('department', department)
    .eq('locked_by', userId)
}

export async function getLock(airfieldId, department) {
  const { data } = await supabase
    .from('record_locks')
    .select('*, profiles(full_name, department)')
    .eq('airfield_id', airfieldId)
    .eq('department', department)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  return data
}

export function subscribeLocks(airfieldId, onChange) {
  return supabase.channel(`locks:${airfieldId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'record_locks',
      filter: `airfield_id=eq.${airfieldId}`
    }, onChange)
    .subscribe()
}
