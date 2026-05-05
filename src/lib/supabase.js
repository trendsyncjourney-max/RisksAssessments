import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://wguibejjtypjiftjtbbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndWliZWpqdHlwamlmdGp0YmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Njc5MDgsImV4cCI6MjA5MzU0MzkwOH0.tS_0e4BrnbQ-hsrKNYXxPSE83K1Fl_Vn7-FxbnT3sD8'
)
