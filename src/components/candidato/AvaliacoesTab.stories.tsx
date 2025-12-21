import type { Meta, StoryObj } from '@storybook/react';
import { AvaliacoesTab } from './AvaliacoesTab';
const meta: Meta<typeof AvaliacoesTab> = { title: 'Components/candidato/AvaliacoesTab', component: AvaliacoesTab, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AvaliacoesTab>;
export const Default: Story = { args: {} };
