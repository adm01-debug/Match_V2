import type { Meta, StoryObj } from '@storybook/react';
import { CandidatoKanbanCard } from './CandidatoKanbanCard';

const meta: Meta<typeof CandidatoKanbanCard> = {
  title: 'Components/pipeline/CandidatoKanbanCard',
  component: CandidatoKanbanCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CandidatoKanbanCard>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {},
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro' } },
};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
