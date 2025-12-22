import type { Meta, StoryObj } from '@storybook/react';
import { ResumeParser } from './ResumeParser';
const meta: Meta<typeof ResumeParser> = { title: 'Components/ResumeParser', component: ResumeParser, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
