-- EFB Monthly Compliance Audit — admin overrides table.
-- Run in Supabase SQL Editor.
-- This tool has no login of its own, so it talks to Supabase as the
-- anonymous (anon) role — policies below grant that role access.

CREATE TABLE IF NOT EXISTS lido_email_overrides (
  lido_id text PRIMARY KEY,
  correct_email text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lido_email_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users can read overrides" ON lido_email_overrides;
DROP POLICY IF EXISTS "authenticated users can manage overrides" ON lido_email_overrides;

CREATE POLICY "anyone can read overrides" ON lido_email_overrides
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anyone can manage overrides" ON lido_email_overrides
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
