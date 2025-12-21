import type { Meta, StoryObj } from '@storybook/react';
import { ResultadoProvaView } from './ResultadoProvaView';
const meta: Meta<typeof ResultadoProvaView> = { title: 'Components/tests/ResultadoProvaView', component: ResultadoProvaView, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ResultadoProvaView>;
export const Default: Story = { args: {} };
