-- Enable Row Level Security (RLS) on tenant-scoped tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "insights" ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners/superusers
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
ALTER TABLE "customers" FORCE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
ALTER TABLE "sales" FORCE ROW LEVEL SECURITY;
ALTER TABLE "insights" FORCE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflict)
DROP POLICY IF EXISTS "tenant_isolation_users" ON "users";
DROP POLICY IF EXISTS "tenant_isolation_customers" ON "customers";
DROP POLICY IF EXISTS "tenant_isolation_products" ON "products";
DROP POLICY IF EXISTS "tenant_isolation_sales" ON "sales";
DROP POLICY IF EXISTS "tenant_isolation_insights" ON "insights";

-- Create policies based on session variable 'app.current_tenant_id'
CREATE POLICY "tenant_isolation_users" ON "users"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_customers" ON "customers"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_products" ON "products"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_sales" ON "sales"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_insights" ON "insights"
    AS PERMISSIVE FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_tenant_id', true))
    WITH CHECK (company_id = current_setting('app.current_tenant_id', true));
