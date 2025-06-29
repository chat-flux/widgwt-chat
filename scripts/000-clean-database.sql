-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS function_calls CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS functions CASCADE;
DROP TABLE IF EXISTS widget_configs CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop any remaining sequences
DROP SEQUENCE IF EXISTS agents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS conversations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS messages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS documents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS functions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS function_calls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS widget_configs_id_seq CASCADE;

-- Clean up any remaining objects
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all remaining tables that might exist
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Drop all remaining functions
    FOR r IN (SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.proname) || '() CASCADE';
    END LOOP;
END $$;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('agents', 'id'), 1, false) WHERE pg_get_serial_sequence('agents', 'id') IS NOT NULL;
