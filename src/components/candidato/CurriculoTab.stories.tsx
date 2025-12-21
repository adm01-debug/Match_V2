import type { Meta, StoryObj } from '@storybook/react';
import { CurriculoTab } from './CurriculoTab';
const meta: Meta<typeof CurriculoTab> = { title: 'Components/candidato/CurriculoTab', component: CurriculoTab, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof CurriculoTab>;
export const Default: Story = { args: {} };
