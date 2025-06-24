CREATE OR REPLACE FUNCTION ver_campos_dela_tabla(tabla TEXT)
RETURNS TABLE(column_name TEXT, data_type TEXT) AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT column_name::TEXT, data_type::TEXT
     FROM information_schema.columns
     WHERE table_name = %L', tabla
  );
END;
$$ LANGUAGE plpgsql;
