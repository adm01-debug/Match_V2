import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { QuestaoForm } from './QuestaoForm';
const meta: Meta<typeof QuestaoForm> = { title: 'Components/tests/QuestaoForm', component: QuestaoForm, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof QuestaoForm>;
export const Default: Story = { args: {} };
