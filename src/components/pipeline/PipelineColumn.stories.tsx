import type { Meta, StoryObj } from '@storybook/react';
import { PipelineColumn } from './PipelineColumn';
const meta: Meta<typeof PipelineColumn> = { title: 'Components/PipelineColumn', component: PipelineColumn, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
