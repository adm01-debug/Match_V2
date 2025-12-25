import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ResultadoProvaView } from './ResultadoProvaView';
const meta: Meta<typeof ResultadoProvaView> = { title: 'Components/tests/ResultadoProvaView', component: ResultadoProvaView,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ResultadoProvaView>;
export const Default: Story = { args: {} 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },
};
