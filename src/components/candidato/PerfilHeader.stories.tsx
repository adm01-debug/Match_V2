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
