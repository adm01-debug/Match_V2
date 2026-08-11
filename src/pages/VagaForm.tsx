import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useVaga, useCreateVaga, useUpdateVaga } from "@/hooks/useVagas";
import { TipoContrato, Modalidade, Prioridade } from "@/types/recruitment";
import { ArrowLeft, Save, Send, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VagaFormBasicInfo, VagaFormDetails, VagaFormDescription, VagaFormTriagem } from "@/components/vaga-form";

export default function VagaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const { data: existingVaga, isLoading: isLoadingVaga } = useVaga(id || '');
  const createVaga = useCreateVaga();
  const updateVaga = useUpdateVaga();

  const [formData, setFormData] = useState({
    titulo: "", departamento: "", quantidade: 1, gestorNome: "", recrutadorNome: "Maria Santos",
    prioridade: "media" as Prioridade, tipoContrato: "clt" as TipoContrato, modalidade: "presencial" as Modalidade,
    cidade: "São Paulo", estado: "SP", salarioMin: "" as string | number, salarioMax: "" as string | number,
    salarioACombinar: false, horarioTrabalho: "Segunda a Sexta, 08:00 às 18:00",
    beneficios: [] as string[],
    descricaoEmpresa: "A Promo Brindes é uma empresa líder no mercado de brindes promocionais há mais de 11 anos, atendendo grandes clientes corporativos em todo o Brasil.",
    responsabilidades: "", requisitosObrigatorios: "", requisitosDesejaveis: "",
    canaisDivulgacao: ["portal", "linkedin", "indeed"],
  });

  const [perguntasTriagem, setPerguntasTriagem] = useState<Array<{ pergunta: string; eliminatoria: boolean }>>([]);
  const [skills, setSkills] = useState<string[]>([]);

  usePageTitle('Formulário de Vaga');

  useEffect(() => {
    if (existingVaga) {
      setFormData({
        titulo: existingVaga.titulo, departamento: existingVaga.departamento, quantidade: existingVaga.quantidade,
        gestorNome: existingVaga.gestorNome, recrutadorNome: existingVaga.recrutadorNome, prioridade: existingVaga.prioridade,
        tipoContrato: existingVaga.tipoContrato, modalidade: existingVaga.modalidade, cidade: existingVaga.cidade,
        estado: existingVaga.estado, salarioMin: existingVaga.salarioMin || "", salarioMax: existingVaga.salarioMax || "",
        salarioACombinar: existingVaga.salarioACombinar, horarioTrabalho: "Segunda a Sexta, 08:00 às 18:00",
        beneficios: existingVaga.beneficios, descricaoEmpresa: existingVaga.descricaoEmpresa,
        responsabilidades: existingVaga.responsabilidades, requisitosObrigatorios: existingVaga.requisitosObrigatorios,
        requisitosDesejaveis: existingVaga.requisitosDesejaveis, canaisDivulgacao: ["portal", "linkedin", "indeed"],
      });
      setPerguntasTriagem(existingVaga.perguntasTriagem?.map(p => ({ pergunta: p.pergunta, eliminatoria: p.eliminatoria })) || []);
      setSkills(existingVaga.skillsAvaliacao || []);
    }
  }, [existingVaga]);

  const handleChange = (field: string, value: string | number | boolean | string[]) => {
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

  const handleSave = async (publish: boolean = false) => {
    if (!formData.titulo || !formData.departamento) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }

    const vagaData = {
      titulo: formData.titulo, departamento: formData.departamento, gestorNome: formData.gestorNome,
      recrutadorNome: formData.recrutadorNome, quantidade: formData.quantidade, tipoContrato: formData.tipoContrato,
      modalidade: formData.modalidade, cidade: formData.cidade, estado: formData.estado,
      salarioMin: formData.salarioMin ? Number(formData.salarioMin) : undefined,
      salarioMax: formData.salarioMax ? Number(formData.salarioMax) : undefined,
      salarioACombinar: formData.salarioACombinar, beneficios: formData.beneficios,
      descricaoEmpresa: formData.descricaoEmpresa, responsabilidades: formData.responsabilidades,
      requisitosObrigatorios: formData.requisitosObrigatorios, requisitosDesejaveis: formData.requisitosDesejaveis,
      perguntasTriagem: perguntasTriagem.map(p => ({ pergunta: p.pergunta, tipo: 'sim_nao' as const, eliminatoria: p.eliminatoria })),
      skillsAvaliacao: skills, status: publish ? 'publicada' : 'rascunho', prioridade: formData.prioridade,
      dataPublicacao: publish ? new Date() : undefined,
      totalCandidatos: existingVaga?.totalCandidatos || 0, emProcesso: existingVaga?.emProcesso || 0, contratados: existingVaga?.contratados || 0,
    };

    try {
      if (isEditing && id) { await updateVaga.mutateAsync({ id, ...vagaData }); }
      else { await createVaga.mutateAsync(vagaData); }
      toast({ title: publish ? "Vaga publicada!" : "Vaga salva!", description: publish ? "A vaga foi publicada e está disponível para candidaturas." : "As alterações foram salvas com sucesso." });
      navigate("/vagas");
    } catch {
      toast({ title: "Erro ao salvar", description: "Ocorreu um erro ao salvar a vaga. Tente novamente.", variant: "destructive" });
    }
  };

  const isSaving = createVaga.isPending || updateVaga.isPending;

  if (isEditing && isLoadingVaga) {
    return (
      <Layout title="Carregando...">
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditing ? "Editar Vaga" : "Nova Vaga"}>
      <div className="p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vagas")}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{isEditing ? "Editar Vaga" : "Nova Vaga"}</h2>
              <p className="text-muted-foreground">{isEditing ? "Atualize as informações da vaga" : "Preencha as informações para criar uma nova vaga"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <VagaFormBasicInfo formData={formData} onChange={handleChange} />
          <VagaFormDetails formData={formData} onChange={handleChange} onToggleBeneficio={toggleBeneficio} />
          <VagaFormDescription formData={formData} onChange={handleChange} />
          <VagaFormTriagem
            perguntasTriagem={perguntasTriagem}
            onAddPergunta={() => setPerguntasTriagem((prev) => [...prev, { pergunta: "", eliminatoria: false }])}
            onRemovePergunta={(index) => setPerguntasTriagem((prev) => prev.filter((_, i) => i !== index))}
            onUpdatePergunta={(index, field, value) => setPerguntasTriagem((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))}
            skills={skills}
            onAddSkill={(skill) => setSkills((prev) => [...prev, skill])}
            onRemoveSkill={(skill) => setSkills((prev) => prev.filter((s) => s !== skill))}
            canais={formData.canaisDivulgacao}
            onToggleCanal={toggleCanal}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => navigate("/vagas")} disabled={isSaving}><X className="h-4 w-4 mr-2" />Cancelar</Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Salvar Rascunho
              </Button>
              <Button onClick={() => handleSave(true)} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}Publicar Vaga
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
