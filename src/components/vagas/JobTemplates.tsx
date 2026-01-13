import { useState, useMemo } from 'react';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Copy, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobTemplate { id: string; name: string; description: string; category: string; requirements: string[]; benefits: string[]; salary_range?: string; contract_type: string; }

const DEFAULT_TEMPLATES: JobTemplate[] = [
  { id: '1', name: 'Desenvolvedor Full Stack', description: 'Desenvolvedor experiente em tecnologias web modernas...', category: 'Tecnologia', requirements: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], benefits: ['VR/VA', 'Plano de Saúde', 'Home Office'], contract_type: 'CLT' },
  { id: '2', name: 'Analista de RH', description: 'Profissional de RH com foco em R&S...', category: 'RH', requirements: ['Experiência em R&S', 'Excel Avançado', 'Entrevistas comportamentais'], benefits: ['VR/VA', 'Plano de Saúde'], contract_type: 'CLT' },
  { id: '3', name: 'Designer UX/UI', description: 'Designer criativo para interfaces digitais...', category: 'Design', requirements: ['Figma', 'Design System', 'Prototipagem'], benefits: ['VR/VA', 'Plano de Saúde', 'Gympass'], contract_type: 'CLT' },
];

interface JobTemplatesProps { onSelectTemplate?: (template: JobTemplate) => void; }

export function JobTemplates({ onSelectTemplate }: JobTemplatesProps) {
  const [templates, setTemplates] = useState<JobTemplate[]>(DEFAULT_TEMPLATES);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', category: '', requirements: '', benefits: '', contract_type: 'CLT' });
  const { toast } = useToast();

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults } = useFuzzySearch(
    templates,
    [
      { name: 'name', weight: 2 },
      { name: 'category', weight: 1 },
      { name: 'description', weight: 0.5 },
    ],
    search,
    { ...FUZZY_PRESETS.default }
  );

  const filtered = useMemo(() => search ? fuzzyResults : templates, [templates, fuzzyResults, search]);
  const categories = [...new Set(templates.map(t => t.category))];

  const handleCreate = () => {
    const template: JobTemplate = {
      id: Date.now().toString(), name: newTemplate.name, description: newTemplate.description, category: newTemplate.category,
      requirements: newTemplate.requirements.split(',').map(s => s.trim()).filter(Boolean),
      benefits: newTemplate.benefits.split(',').map(s => s.trim()).filter(Boolean),
      contract_type: newTemplate.contract_type,
    };
    setTemplates([...templates, template]);
    setIsDialogOpen(false);
    setNewTemplate({ name: '', description: '', category: '', requirements: '', benefits: '', contract_type: 'CLT' });
    toast({ title: 'Template criado', description: `"${template.name}" salvo com sucesso.` });
  };

  const handleUse = (template: JobTemplate) => { onSelectTemplate?.(template); toast({ title: 'Template aplicado', description: 'Os campos foram preenchidos.' }); };
  const handleDelete = (id: string) => { setTemplates(templates.filter(t => t.id !== id)); toast({ title: 'Excluído', description: 'Template removido.' }); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Templates de Vagas</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Template</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Template</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nome do template" value={newTemplate.name} onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })} />
              <Input placeholder="Categoria" value={newTemplate.category} onChange={e => setNewTemplate({ ...newTemplate, category: e.target.value })} />
              <Textarea placeholder="Descrição..." value={newTemplate.description} onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })} />
              <Input placeholder="Requisitos (separados por vírgula)" value={newTemplate.requirements} onChange={e => setNewTemplate({ ...newTemplate, requirements: e.target.value })} />
              <Input placeholder="Benefícios (separados por vírgula)" value={newTemplate.benefits} onChange={e => setNewTemplate({ ...newTemplate, benefits: e.target.value })} />
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button><Button onClick={handleCreate}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar templates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <div className="flex gap-2 flex-wrap">{categories.map(cat => <Badge key={cat} variant="outline">{cat}</Badge>)}</div>
        <div className="grid gap-3">
          {filtered.map(template => (
            <div key={template.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div><h3 className="font-medium">{template.name}</h3><Badge variant="secondary" className="mt-1">{template.category}</Badge></div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleUse(template)}><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(template.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
              <div className="flex gap-1 mt-2 flex-wrap">{template.requirements.slice(0, 3).map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default JobTemplates;
