import type { Meta, StoryObj } from '@storybook/react';
import { WorkflowEditorWithProvider } from './WorkflowEditor';
import type { Workflow } from '@/types/workflow';

const meta: Meta<typeof WorkflowEditorWithProvider> = {
  title: 'Workflow/WorkflowEditor',
  component: WorkflowEditorWithProvider,
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

const emptyWorkflow: Workflow = {
  id: '1',
  name: 'Novo Workflow',
  description: '',
  isActive: false,
  nodes: [],
  edges: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const simpleWorkflow: Workflow = {
  id: '2',
  name: 'Workflow Simples',
  description: 'Workflow de exemplo',
  isActive: true,
  nodes: [
    { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Nova candidatura', trigger: 'candidate_applied' } },
    { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { label: 'Enviar email', action: 'send_email' } },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const complexWorkflow: Workflow = {
  id: '3',
  name: 'Workflow Complexo',
  description: 'Workflow com condições',
  isActive: true,
  nodes: [
    { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Candidato aprovado', trigger: 'candidate_stage_changed' } },
    { id: '2', type: 'condition', position: { x: 250, y: 150 }, data: { label: 'Vaga CLT?' } },
    { id: '3', type: 'action', position: { x: 100, y: 250 }, data: { label: 'Enviar proposta CLT', action: 'send_email' } },
    { id: '4', type: 'action', position: { x: 400, y: 250 }, data: { label: 'Enviar proposta PJ', action: 'send_email' } },
    { id: '5', type: 'delay', position: { x: 250, y: 350 }, data: { label: 'Aguardar 2 dias' } },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', label: 'Sim' },
    { id: 'e2-4', source: '2', target: '4', label: 'Não' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e4-5', source: '4', target: '5' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Empty: Story = {
  args: {
    workflow: emptyWorkflow,
    onSave: () => console.log('Salvando...'),
  },
};

export const WithTrigger: Story = {
  args: {
    workflow: simpleWorkflow,
    onSave: () => console.log('Salvando...'),
  },
};

export const SimpleWorkflow: Story = {
  args: {
    workflow: simpleWorkflow,
    onSave: () => console.log('Salvando...'),
  },
};

export const ComplexWorkflow: Story = {
  args: {
    workflow: complexWorkflow,
    onSave: () => console.log('Salvando...'),
  },
};
