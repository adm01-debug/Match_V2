import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ExperienciaTab } from './ExperienciaTab';
const meta: Meta<typeof ExperienciaTab> = { title: 'Components/ExperienciaTab', component: ExperienciaTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
