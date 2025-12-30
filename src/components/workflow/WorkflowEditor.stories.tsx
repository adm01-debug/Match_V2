import type { Meta, StoryObj } from '@storybook/react';
import { WorkflowEditor } from './WorkflowEditor';

const meta: Meta<typeof WorkflowEditor> = {
  title: 'Workflow/WorkflowEditor',
  component: WorkflowEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Editor visual de workflows com drag-and-drop para automação de processos.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    nodes: [],
    edges: [],
    onSave: (data) => console.log('Salvando:', data),
  },
};

export const WithTrigger: Story = {
  args: {
    nodes: [
      { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Candidato criado', triggerType: 'candidato_criado' } },
    ],
    edges: [],
    onSave: (data) => console.log('Salvando:', data),
  },
};

export const SimpleWorkflow: Story = {
  args: {
    nodes: [
      { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Nova candidatura', triggerType: 'candidatura_criada' } },
      { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { label: 'Enviar email', actionType: 'send_email' } },
      { id: '3', type: 'end', position: { x: 250, y: 250 }, data: { label: 'Fim', status: 'success' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    onSave: (data) => console.log('Salvando:', data),
  },
};

export const ComplexWorkflow: Story = {
  args: {
    nodes: [
      { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Candidato aprovado', triggerType: 'etapa_alterada' } },
      { id: '2', type: 'condition', position: { x: 250, y: 150 }, data: { label: 'Vaga CLT?', condition: 'vaga.tipo == "CLT"' } },
      { id: '3', type: 'action', position: { x: 100, y: 250 }, data: { label: 'Enviar proposta CLT', actionType: 'send_email' } },
      { id: '4', type: 'action', position: { x: 400, y: 250 }, data: { label: 'Enviar proposta PJ', actionType: 'send_email' } },
      { id: '5', type: 'notification', position: { x: 250, y: 350 }, data: { label: 'Notificar gestor', notificationType: 'push' } },
      { id: '6', type: 'end', position: { x: 250, y: 450 }, data: { label: 'Concluído', status: 'success' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Sim' },
      { id: 'e2-4', source: '2', target: '4', label: 'Não' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
    ],
    onSave: (data) => console.log('Salvando:', data),
  },
};

export const ReadOnly: Story = {
  args: {
    ...SimpleWorkflow.args,
    readOnly: true,
  },
};
