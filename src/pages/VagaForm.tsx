import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVaga, useCreateVaga, useUpdateVaga } from "@/hooks/useVagas";
import { TipoContrato, Modalidade, Prioridade } from "@/types/recruitment";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  X, 
  Plus, 
  Trash2,
  Building2,
  MapPin,
  FileText,
  Target,
  Share2,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema de validação
const vagaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  localizacao: z.string().optional(),
  tipo_contrato: z.string().min(1, 'Tipo de contrato é obrigatório'),
  nivel_experiencia: z.string().min(1, 'Nível de experiência é obrigatório'),
  faixa_salarial: z.string().optional(),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  requisitos: z.string().optional(),
  beneficios: z.string().optional(),
  prioridade: z.string().default('normal'),
  status: z.string().default('aberta'),
});

type VagaFormData = z.infer<typeof vagaSchema>;



const departamentos = [
  "Produção",
  "Marketing/Arte",
  "Comercial",
  "Financeiro",
  "Administrativo",
  "Logística",
  "TI",
  "RH",
];

const gestores = [
  { id: "g1", nome: "Carlos Mendes", departamento: "Produção" },
  { id: "g2", nome: "Fernanda Lima", departamento: "Marketing/Arte" },
  { id: "g3", nome: "Paulo Roberto", departamento: "Comercial" },
  { id: "g4", nome: "Ricardo Almeida", departamento: "Financeiro" },
  { id: "g5", nome: "Lucia Ferreira", departamento: "Administrativo" },
];

const recrutadores = [
  { id: "r1", nome: "Maria Santos" },
  { id: "r2", nome: "João Silva" },
];

const beneficiosOpcoes = [
  "Vale Transporte",
  "Vale Refeição",
  "Vale Alimentação",
  "Plano de Saúde",
  "Plano Odontológico",
  "Seguro de Vida",
  "PLR",
  "Bônus",
  "Gympass",
  "Home Office",
  "Auxílio Creche",
];

const canaisDivulgacao = [
  { id: "portal", nome: "Portal de Vagas (site próprio)" },
  { id: "linkedin", nome: "LinkedIn" },
  { id: "indeed", nome: "Indeed" },
  { id: "catho", nome: "Catho" },
  { id: "infojobs", nome: "InfoJobs" },
  { id: "whatsapp", nome: "WhatsApp (grupos internos)" },
  { id: "instagram", nome: "Instagram" },
];

export default function VagaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const { data: existingVaga, isLoading: isLoadingVaga } = useVaga(id || '');
  const createVaga = useCreateVaga();
  const updateVaga = useUpdateVaga();

  const [formData, setFormData] = useState({
    titulo: "",
    departamento: "",
    quantidade: 1,
    gestorNome: "",
    recrutadorNome: "Maria Santos",
    prioridade: "media" as Prioridade,
    tipoContrato: "clt" as TipoContrato,
    modalidade: "presencial" as Modalidade,
    cidade: "São Paulo",
    estado: "SP",
    salarioMin: "" as string | number,
    salarioMax: "" as string | number,
    salarioACombinar: false,
    horarioTrabalho: "Segunda a Sexta, 08:00 às 18:00",
    beneficios: [] as string[],
    descricaoEmpresa: "A Promo Brindes é uma empresa líder no mercado de brindes promocionais há mais de 11 anos, atendendo grandes clientes corporativos em todo o Brasil.",
    responsabilidades: "",
    requisitosObrigatorios: "",
    requisitosDesejaveis: "",
    canaisDivulgacao: ["portal", "linkedin", "indeed"],
  });

  const [perguntasTriagem, setPerguntasTriagem] = useState<Array<{
    pergunta: string;
    eliminatoria: boolean;
  }>>([]);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Load existing vaga data when editing
  useEffect(() => {
  usePageTitle('Formulário de Vaga');

    if (existingVaga) {
      setFormData({
        titulo: existingVaga.titulo,
        departamento: existingVaga.departamento,
        quantidade: existingVaga.quantidade,
        gestorNome: existingVaga.gestorNome,
        recrutadorNome: existingVaga.recrutadorNome,
        prioridade: existingVaga.prioridade,
        tipoContrato: existingVaga.tipoContrato,
        modalidade: existingVaga.modalidade,
        cidade: existingVaga.cidade,
        estado: existingVaga.estado,
        salarioMin: existingVaga.salarioMin || "",
        salarioMax: existingVaga.salarioMax || "",
        salarioACombinar: existingVaga.salarioACombinar,
        horarioTrabalho: "Segunda a Sexta, 08:00 às 18:00",
        beneficios: existingVaga.beneficios,
        descricaoEmpresa: existingVaga.descricaoEmpresa,
        responsabilidades: existingVaga.responsabilidades,
        requisitosObrigatorios: existingVaga.requisitosObrigatorios,
        requisitosDesejaveis: existingVaga.requisitosDesejaveis,
        canaisDivulgacao: ["portal", "linkedin", "indeed"],
      });
      setPerguntasTriagem(
        existingVaga.perguntasTriagem?.map(p => ({ 
          pergunta: p.pergunta, 
          eliminatoria: p.eliminatoria 
        })) || []
      );
      setSkills(existingVaga.skillsAvaliacao || []);
    }
  }, [existingVaga]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBeneficio = (beneficio: string) => {
    setFormData((prev) => ({
      ...prev,
      beneficios: prev.beneficios.includes(beneficio)
        ? prev.beneficios.filter((b) => b !== beneficio)
        : [...prev.beneficios, beneficio],
    }));
  };

  const toggleCanal = (canal: string) => {
    setFormData((prev) => ({
      ...prev,
      canaisDivulgacao: prev.canaisDivulgacao.includes(canal)
        ? prev.canaisDivulgacao.filter((c) => c !== canal)
        : [...prev.canaisDivulgacao, canal],
    }));
  };

  const addPergunta = () => {
    setPerguntasTriagem((prev) => [...prev, { pergunta: "", eliminatoria: false }]);
  };

  const removePergunta = (index: number) => {
    setPerguntasTriagem((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePergunta = (index: number, field: string, value: any) => {
    setPerguntasTriagem((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.titulo || !formData.departamento) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const vagaData = {
      titulo: formData.titulo,
      departamento: formData.departamento,
      gestorNome: formData.gestorNome,
      recrutadorNome: formData.recrutadorNome,
      quantidade: formData.quantidade,
      tipoContrato: formData.tipoContrato,
      modalidade: formData.modalidade,
      cidade: formData.cidade,
      estado: formData.estado,
      salarioMin: formData.salarioMin ? Number(formData.salarioMin) : undefined,
      salarioMax: formData.salarioMax ? Number(formData.salarioMax) : undefined,
      salarioACombinar: formData.salarioACombinar,
      beneficios: formData.beneficios,
      descricaoEmpresa: formData.descricaoEmpresa,
      responsabilidades: formData.responsabilidades,
      requisitosObrigatorios: formData.requisitosObrigatorios,
      requisitosDesejaveis: formData.requisitosDesejaveis,
      perguntasTriagem: perguntasTriagem.map(p => ({
        pergunta: p.pergunta,
        tipo: 'sim_nao' as const,
        eliminatoria: p.eliminatoria,
      })),
      skillsAvaliacao: skills,
      status: publish ? 'publicada' : 'rascunho',
      prioridade: formData.prioridade,
      dataPublicacao: publish ? new Date() : undefined,
      totalCandidatos: existingVaga?.totalCandidatos || 0,
      emProcesso: existingVaga?.emProcesso || 0,
      contratados: existingVaga?.contratados || 0,
    };

    try {
      if (isEditing && id) {
        await updateVaga.mutateAsync({ id, ...vagaData });
      } else {
        await createVaga.mutateAsync(vagaData);
      }

      toast({
        title: publish ? "Vaga publicada!" : "Vaga salva!",
        description: publish 
          ? "A vaga foi publicada e está disponível para candidaturas."
          : "As alterações foram salvas com sucesso.",
      });
      
      navigate("/vagas");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a vaga. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const isSaving = createVaga.isPending || updateVaga.isPending;

  if (isEditing && isLoadingVaga) {
    return (
      <Layout title="Carregando...">
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditing ? "Editar Vaga" : "Nova Vaga"}>
      <div className="p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vagas")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isEditing ? "Editar Vaga" : "Nova Vaga"}
              </h2>
              <p className="text-muted-foreground">
                {isEditing ? "Atualize as informações da vaga" : "Preencha as informações para criar uma nova vaga"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="titulo">Título da Vaga *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleChange("titulo", e.target.value)}
                    placeholder="Ex: Operador de Gravação"
                  />
                </div>

                <div>
                  <Label htmlFor="departamento">Área/Departamento *</Label>
                  <Select
                    value={formData.departamento}
                    onValueChange={(v) => handleChange("departamento", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {departamentos.map((dep) => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantidade">Quantidade de Vagas *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min={1}
                    value={formData.quantidade}
                    onChange={(e) => handleChange("quantidade", parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="gestor">Gestor Responsável</Label>
                  <Input
                    id="gestor"
                    value={formData.gestorNome}
                    onChange={(e) => handleChange("gestorNome", e.target.value)}
                    placeholder="Nome do gestor responsável"
                  />
                </div>

                <div>
                  <Label htmlFor="recrutador">Recrutador Responsável</Label>
                  <Input
                    id="recrutador"
                    value={formData.recrutadorNome}
                    onChange={(e) => handleChange("recrutadorNome", e.target.value)}
                    placeholder="Nome do recrutador responsável"
                  />
                </div>

                <div>
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(v) => handleChange("prioridade", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="urgente">🔥 Urgente</SelectItem>
                      <SelectItem value="alta">⚠️ Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Posição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-primary" />
                Detalhes da Posição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                  <Select
                    value={formData.tipoContrato}
                    onValueChange={(v) => handleChange("tipoContrato", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
                      <SelectItem value="temporario">Temporário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="modalidade">Modalidade</Label>
                  <Select
                    value={formData.modalidade}
                    onValueChange={(v) => handleChange("modalidade", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="horario">Horário de Trabalho</Label>
                  <Input
                    id="horario"
                    value={formData.horarioTrabalho}
                    onChange={(e) => handleChange("horarioTrabalho", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Faixa Salarial</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={formData.salarioMin}
                    onChange={(e) => handleChange("salarioMin", e.target.value)}
                    disabled={formData.salarioACombinar}
                    className="w-40"
                  />
                  <span className="text-muted-foreground">até</span>
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={formData.salarioMax}
                    onChange={(e) => handleChange("salarioMax", e.target.value)}
                    disabled={formData.salarioACombinar}
                    className="w-40"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="salarioACombinar"
                      checked={formData.salarioACombinar}
                      onCheckedChange={(v) => handleChange("salarioACombinar", v)}
                    />
                    <Label htmlFor="salarioACombinar" className="text-sm font-normal">
                      A combinar
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Benefícios</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {beneficiosOpcoes.map((beneficio) => (
                    <Badge
                      key={beneficio}
                      variant={formData.beneficios.includes(beneficio) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleBeneficio(beneficio)}
                    >
                      {beneficio}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição da Vaga */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                Descrição da Vaga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="descricaoEmpresa">Sobre a Empresa</Label>
                <Textarea
                  id="descricaoEmpresa"
                  value={formData.descricaoEmpresa}
                  onChange={(e) => handleChange("descricaoEmpresa", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="responsabilidades">Responsabilidades *</Label>
                <Textarea
                  id="responsabilidades"
                  value={formData.responsabilidades}
                  onChange={(e) => handleChange("responsabilidades", e.target.value)}
                  placeholder="• Descreva as principais responsabilidades&#10;• Uma por linha"
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="requisitosObrigatorios">Requisitos Obrigatórios *</Label>
                <Textarea
                  id="requisitosObrigatorios"
                  value={formData.requisitosObrigatorios}
                  onChange={(e) => handleChange("requisitosObrigatorios", e.target.value)}
                  placeholder="• Liste os requisitos obrigatórios&#10;• Um por linha"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="requisitosDesejaveis">Requisitos Desejáveis</Label>
                <Textarea
                  id="requisitosDesejaveis"
                  value={formData.requisitosDesejaveis}
                  onChange={(e) => handleChange("requisitosDesejaveis", e.target.value)}
                  placeholder="• Liste os requisitos desejáveis&#10;• Um por linha"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Critérios de Seleção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-primary" />
                Critérios de Seleção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Perguntas de Triagem */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Perguntas de Triagem (Knockout Questions)</Label>
                  <Button variant="outline" size="sm" onClick={addPergunta}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                {perguntasTriagem.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma pergunta de triagem adicionada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {perguntasTriagem.map((p, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Input
                            value={p.pergunta}
                            onChange={(e) => updatePergunta(index, "pergunta", e.target.value)}
                            placeholder="Digite a pergunta..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={p.eliminatoria}
                            onCheckedChange={(v) => updatePergunta(index, "eliminatoria", v)}
                          />
                          <Label className="text-sm font-normal whitespace-nowrap">
                            Eliminatória
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePergunta(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <Label>Skills/Competências para Avaliação</Label>
                <div className="flex gap-2 mt-2 mb-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Digite uma skill e pressione Enter"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button variant="outline" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canais de Divulgação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Share2 className="h-5 w-5 text-primary" />
                Canais de Divulgação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {canaisDivulgacao.map((canal) => (
                  <div key={canal.id} className="flex items-center gap-2">
                    <Checkbox
                      id={canal.id}
                      checked={formData.canaisDivulgacao.includes(canal.id)}
                      onCheckedChange={() => toggleCanal(canal.id)}
                    />
                    <Label htmlFor={canal.id} className="text-sm font-normal">
                      {canal.nome}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => navigate("/vagas")} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Rascunho
              </Button>
              <Button onClick={() => handleSave(true)} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Publicar Vaga
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

