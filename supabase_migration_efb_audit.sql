-- EFB Monthly Compliance Audit — admin overrides table.
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS lido_email_overrides (
  lido_id text PRIMARY KEY,
  correct_email text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE lido_email_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can read overrides" ON lido_email_overrides
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can manage overrides" ON lido_email_overrides
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
