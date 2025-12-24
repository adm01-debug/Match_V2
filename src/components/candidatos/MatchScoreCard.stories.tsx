import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { MatchScoreCard } from './MatchScoreCard';
const meta: Meta<typeof MatchScoreCard> = { title: 'Components/MatchScoreCard', component: MatchScoreCard, tags: ['autodocs'] };
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
