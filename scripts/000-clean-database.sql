-- Drop all tables in the correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS function_calls CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS widget_configs CASCADE;
DROP TABLE IF EXISTS functions CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- Drop any remaining sequences
DROP SEQUENCE IF EXISTS agents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS conversations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS messages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS documents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS functions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS function_calls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS widget_configs_id_seq CASCADE;

-- Drop any custom functions or triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
