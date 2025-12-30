import type { Workflow } from "@/types/workflow";

export const workflowTemplates: Omit<Workflow, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Triagem Automática",
    description: "Move candidatos automaticamente após avaliação inicial",
    isActive: false,
    nodes: [
      { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Gatilho", trigger: "candidate_applied" } },
      { id: "2", type: "delay", position: { x: 250, y: 100 }, data: { label: "Aguardar", config: { duration: 24, unit: "hours" } } },
      { id: "3", type: "action", position: { x: 250, y: 200 }, data: { label: "Email", action: "send_email", config: { template: "welcome" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
  },
  {
    name: "Agendamento de Entrevista",
    description: "Notifica recrutador quando candidato avança para entrevista",
    isActive: false,
    nodes: [
      { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Gatilho", trigger: "candidate_stage_changed" } },
      { id: "2", type: "condition", position: { x: 250, y: 100 }, data: { label: "Condição", condition: "etapa === entrevista_rh" } },
      { id: "3", type: "action", position: { x: 100, y: 200 }, data: { label: "Notificar", action: "notify_team" } },
      { id: "4", type: "action", position: { x: 100, y: 300 }, data: { label: "Criar Tarefa", action: "create_task" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3", sourceHandle: "yes" },
      { id: "e3-4", source: "3", target: "4" },
    ],
  },
  {
    name: "Feedback Pós-Entrevista",
    description: "Envia pesquisa de satisfação após entrevista",
    isActive: false,
    nodes: [
      { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Gatilho", trigger: "interview_completed" } },
      { id: "2", type: "delay", position: { x: 250, y: 100 }, data: { label: "Aguardar", config: { duration: 1, unit: "days" } } },
      { id: "3", type: "action", position: { x: 250, y: 200 }, data: { label: "Email", action: "send_email", config: { template: "feedback_survey" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
  },
  {
    name: "Onboarding de Aprovados",
    description: "Inicia processo de onboarding para candidatos contratados",
    isActive: false,
    nodes: [
      { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Gatilho", trigger: "offer_accepted" } },
      { id: "2", type: "action", position: { x: 250, y: 100 }, data: { label: "Email", action: "send_email", config: { template: "welcome_hired" } } },
      { id: "3", type: "action", position: { x: 250, y: 200 }, data: { label: "Tarefa", action: "create_task", config: { title: "Preparar onboarding" } } },
      { id: "4", type: "action", position: { x: 250, y: 300 }, data: { label: "Notificar", action: "notify_team" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
    ],
  },
  {
    name: "Nurturing Talent Pool",
    description: "Mantém contato com candidatos no talent pool",
    isActive: false,
    nodes: [
      { id: "1", type: "trigger", position: { x: 250, y: 0 }, data: { label: "Gatilho", trigger: "time_in_stage" } },
      { id: "2", type: "condition", position: { x: 250, y: 100 }, data: { label: "Condição", condition: "dias_sem_contato > 30" } },
      { id: "3", type: "action", position: { x: 100, y: 200 }, data: { label: "Email", action: "send_email", config: { template: "talent_pool_update" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3", sourceHandle: "yes" },
    ],
  },
];
