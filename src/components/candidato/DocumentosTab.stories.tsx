import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { DocumentosTab } from './DocumentosTab';
const meta: Meta<typeof DocumentosTab> = { title: 'Components/candidato/DocumentosTab', component: DocumentosTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DocumentosTab>;
export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },
};
