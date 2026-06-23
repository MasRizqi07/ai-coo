-- AI COO: Row Level Security (RLS) Policies
-- This script enables RLS on all tenant-specific tables and creates policies 
-- that enforce tenant isolation via the 'app.current_tenant_id' session variable.

-- 1. Enable RLS on tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "insights" ENABLE ROW LEVEL SECURITY;

-- 2. Force RLS for table owners (useful if connecting as postgres superuser, 
-- though superusers bypass RLS by default. Better practice is to connect with a standard user in production).
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
ALTER TABLE "customers" FORCE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
ALTER TABLE "sales" FORCE ROW LEVEL SECURITY;
ALTER TABLE "insights" FORCE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Note: current_setting('app.current_tenant_id', true) gets the session variable.
-- The 'true' argument means it won't throw an error if the variable is missing (returns NULL).

-- Users
CREATE POLICY "tenant_isolation_users" ON "users"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

-- Customers
CREATE POLICY "tenant_isolation_customers" ON "customers"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

-- Products
CREATE POLICY "tenant_isolation_products" ON "products"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

-- Sales
CREATE POLICY "tenant_isolation_sales" ON "sales"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

-- Insights
CREATE POLICY "tenant_isolation_insights" ON "insights"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));
