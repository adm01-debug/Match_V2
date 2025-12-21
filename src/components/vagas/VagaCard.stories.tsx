import type { Meta, StoryObj } from '@storybook/react';
import { VagaCard } from './VagaCard';

const meta: Meta<typeof VagaCard> = {
  title: 'Components/vagas/VagaCard',
  component: VagaCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VagaCard>;

export const Default: Story = {
  args: {},
};
