import type { Meta, StoryObj } from '@storybook/react';
import { AcoesRapidas } from './AcoesRapidas';

const meta: Meta<typeof AcoesRapidas> = {
  title: 'Components/AcoesRapidas',
  component: AcoesRapidas,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
