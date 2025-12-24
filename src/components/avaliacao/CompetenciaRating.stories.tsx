import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { CompetenciaRating } from './CompetenciaRating';

const meta: Meta<typeof CompetenciaRating> = {
  title: 'Components/CompetenciaRating',
  component: CompetenciaRating,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
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
