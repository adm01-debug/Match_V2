# Template de Projeto Base - Match ATS

Este documento serve como guia para criar novos projetos com os mesmos padrões e configurações do Match ATS.

## 🛠️ Stack Tecnológica

### Frontend Core
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "typescript": "^5.x",
  "vite": "latest"
}
```

### Estilização
```json
{
  "tailwindcss": "^3.x",
  "tailwindcss-animate": "^1.0.7",
  "tailwind-merge": "^2.6.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "next-themes": "^0.3.0"
}
```

### UI Components (shadcn/ui)
```json
{
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-tooltip": "^1.2.7",
  "lucide-react": "^0.462.0",
  "sonner": "^1.7.4"
}
```

### State Management
```json
{
  "@tanstack/react-query": "^5.83.0",
  "@tanstack/react-query-devtools": "^5.0.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.61.1",
  "@hookform/resolvers": "^3.10.0",
  "zod": "^3.25.76"
}
```

### Backend (Supabase/Lovable Cloud)
```json
{
  "@supabase/supabase-js": "^2.89.0"
}
```

### Utilitários
```json
{
  "date-fns": "^3.6.0",
  "i18next": "^23.16.5",
  "react-i18next": "^15.1.2",
  "recharts": "^2.15.4",
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0"
}
```

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes React
│   ├── ui/              # shadcn/ui components
│   ├── common/          # Componentes reutilizáveis
│   ├── auth/            # Autenticação (Login, 2FA)
│   ├── admin/           # Admin panel
│   ├── analytics/       # Dashboards e gráficos
│   └── [feature]/       # Componentes por feature
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Autenticação
│   ├── use-toast.ts     # Notificações toast
│   └── [feature].ts     # Hooks por feature
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Contexto de autenticação
│   └── [feature].tsx    # Contextos por feature
├── services/            # Serviços/APIs
│   └── [feature]Service.ts
├── lib/                 # Utilitários e helpers
│   ├── utils.ts         # Funções utilitárias
│   ├── validators.ts    # Validadores
│   ├── sanitize.ts      # Sanitização de dados
│   └── rateLimit.ts     # Rate limiting
├── types/               # TypeScript types
├── config/              # Configurações
├── constants/           # Constantes
├── pages/               # Páginas/Rotas
├── integrations/        # Integrações externas
│   └── supabase/        # Cliente Supabase (auto-gerado)
└── i18n/                # Internacionalização

supabase/
├── functions/           # Edge Functions
│   ├── [function-name]/ 
│   │   └── index.ts
├── migrations/          # Migrações do banco
└── config.toml          # Configuração Supabase

docs/                    # Documentação
public/                  # Assets estáticos
```

## 🔐 Padrões de Segurança

### 1. Autenticação
```typescript
// src/contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);
}
```

### 2. Rate Limiting
```typescript
// src/lib/rateLimit.ts
export function createRateLimiter(
  maxRequests: number,
  windowMs: number
) {
  const requests = new Map<string, number[]>();
  
  return (key: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    // ... implementação
  };
}
```

### 3. Sanitização de Dados
```typescript
// src/lib/sanitize.ts
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

### 4. RLS Policies (Supabase)
```sql
-- Sempre ativar RLS
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

-- Policy para usuários verem apenas seus dados
CREATE POLICY "Users can view own data"
ON public.my_table FOR SELECT
USING (auth.uid() = user_id);
```

## 🎨 Design System

### Tokens CSS (index.css)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode tokens */
}
```

### Componentes UI Base
- Button (variants: default, destructive, outline, secondary, ghost, link)
- Card (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Dialog, Sheet, Drawer
- Form, Input, Select, Checkbox, Switch
- Table, Tabs, Accordion
- Toast (via Sonner)

## 📊 Padrões de Dados

### React Query
```typescript
// Hook de dados com React Query
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Mutation com invalidação
export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: CreateItemData) => {
      const { data, error } = await supabase
        .from('items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
```

## 🧪 Testes

### Estrutura
```
src/
├── components/
│   ├── MyComponent.tsx
│   ├── MyComponent.test.tsx      # Testes unitários
│   └── MyComponent.stories.tsx   # Storybook
```

### Vitest Config
```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
```

## 🚀 Edge Functions

### Template de Edge Function
```typescript
// supabase/functions/my-function/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    
    // Lógica da função
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## 📝 Checklist para Novo Projeto

- [ ] Criar projeto no Lovable
- [ ] Habilitar Lovable Cloud (Supabase)
- [ ] Configurar autenticação com auto-confirm
- [ ] Criar tabelas base com RLS
- [ ] Configurar design tokens em index.css
- [ ] Implementar AuthContext
- [ ] Configurar React Query
- [ ] Adicionar i18n se necessário
- [ ] Configurar ESLint/Prettier
- [ ] Criar estrutura de pastas
- [ ] Implementar componentes base

## 🔗 Recursos

- [Lovable Docs](https://docs.lovable.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
