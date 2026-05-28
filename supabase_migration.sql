-- DHL Airfield Assessment v3.1 — column additions for Excel parity
-- Run in Supabase SQL Editor. Each statement is independent — safe to re-run.

-- AIRFIELDS table (GEN tab)
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS lvops_available boolean DEFAULT false;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS lvops_details text;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS airport_of_entry boolean DEFAULT false;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS aip_available boolean DEFAULT false;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS gigsky_coverage text;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS ops_data_readiness text DEFAULT 'Pending';
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS catb_b757 text;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS catb_b767 text;
ALTER TABLE airfields ADD COLUMN IF NOT EXISTS catb_b777 text;

-- RUNWAYS table (FOP Runway tab)
ALTER TABLE runways ADD COLUMN IF NOT EXISTS pcn text;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS approach_lighting text DEFAULT 'None';
ALTER TABLE runways ADD COLUMN IF NOT EXISTS ils_cat1 boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS ils_cat2 boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS ils_cat3 boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_vor boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_rnav boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_rnp boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_circling boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_gnss boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_loc boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS nav_ndb boolean DEFAULT false;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b757_mtow integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b757_mlw integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b757_mtw integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b757_max_twy integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b767_mtow integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b767_mlw integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b767_mtw integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b767_max_twy integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b777_mtow integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b777_mlw integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b777_mtw integer;
ALTER TABLE runways ADD COLUMN IF NOT EXISTS weight_b777_max_twy integer;

-- FSS_ASSESSMENTS table (FOP Restrictions tab)
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS simultaneous_runway_ops boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS ats_ground_movement boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS rff_category text DEFAULT '9';
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS rff_hours text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS wildlife_hazard text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS fmc_b757 text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS fmc_b767 text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS fmc_b777 text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS lido_ipad boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS paper_backup boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS taws_b757 boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS taws_b767 boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS taws_b777 boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS raas_b757 boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS raas_b767 boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS raas_b777 boolean DEFAULT false;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS runway_restrictions text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS taxiway_restrictions text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS apron_restrictions text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS fleet_limitations text;
ALTER TABLE fss_assessments ADD COLUMN IF NOT EXISTS additional_comments text;

-- GOP_ASSESSMENTS table (GOP tab)
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS dhl_network_station boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS dhl_supervised boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS sgha_in_place boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS sable_system boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS supervision_requirements text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS loading_docs_producer text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS loading_docs_deliverer text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS loadmaster_required boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS catering boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS disinsection boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS crew_transit boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS jumpseat_available boolean DEFAULT false;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS fuel_arrangements text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS immigration_visa text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS innoculation text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS isos_country_report text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS isos_city_report text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS iata_fuel_quality text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS deice_quality_pool text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS airport_info_directory text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS dhl_quality_audit text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS country_reporting text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS global_security_report text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS dhl_security_assessment text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS acc3_validation text DEFAULT 'Pending';
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS acc3_notes text;
ALTER TABLE gop_assessments ADD COLUMN IF NOT EXISTS dg_approved boolean DEFAULT false;

-- SAFETY_ASSESSMENTS table (Safety tab)
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS ra_completed text DEFAULT 'Pending';
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS ra_form_attach text;
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS safety_comments text;
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS uncontrolled_ra text;
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS additional_ra_1 text;
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS additional_ra_2 text;
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS additional_ra_3 text;
ALTER TABLE safety_assessments ADD COLUMN IF NOT EXISTS supporting_documents text;

-- ENG_ASSESSMENTS table (ENG tab)
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS eng_support_available boolean DEFAULT false;
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS flying_spanner_required boolean DEFAULT false;
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS spanner_available boolean DEFAULT false;
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS eng_contact text;
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS support_provider text;
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS contact_details text;
ALTER TABLE eng_assessments ADD COLUMN IF NOT EXISTS eng_comments text;

-- MGT_ASSESSMENTS table (MGT tab)
ALTER TABLE mgt_assessments ADD COLUMN IF NOT EXISTS management_comments text;
ALTER TABLE mgt_assessments ADD COLUMN IF NOT EXISTS mgt_notes text;
ALTER TABLE mgt_assessments ADD COLUMN IF NOT EXISTS approved_by_mgt boolean DEFAULT false;

-- RPC: clean_expired_locks (called by acquireLock in src/lib/locks.js)
CREATE OR REPLACE FUNCTION clean_expired_locks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM record_locks WHERE expires_at < now();
END;
$$;
