import re
import os

tables = set()
rls_enabled = set()

migration_files = [f for f in os.listdir('supabase/migrations') if f.endswith('.sql')]

for filename in migration_files:
    path = os.path.join('supabase/migrations', filename)
    with open(path, 'r') as f:
        content = f.read()
        # Find CREATE TABLE
        matches = re.findall(r'CREATE\s+TABLE\s+(?:public\.)?([\w"]+)', content, re.IGNORECASE)
        for m in matches:
            tables.add(m.strip('"'))
        
        # Find ENABLE RLS
        rls_matches = re.findall(r'ALTER\s+TABLE\s+(?:public\.)?([\w"]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY', content, re.IGNORECASE)
        for rm in rls_matches:
            rls_enabled.add(rm.strip('"'))

missing_rls = tables - rls_enabled
print("Tables potentially missing RLS:")
for t in sorted(missing_rls):
    print(t)
