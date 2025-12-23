import type { Meta, StoryObj } from '@storybook/react';
import { PerfilHeader } from './PerfilHeader';

const meta: Meta<typeof PerfilHeader> = {
  title: 'Components/candidato/PerfilHeader',
  component: PerfilHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PerfilHeader>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {},
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro ao carregar' } },
};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
