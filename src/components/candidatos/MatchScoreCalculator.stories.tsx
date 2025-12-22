import type { Meta, StoryObj } from '@storybook/react';
import { MatchScoreCalculator } from './MatchScoreCalculator';
const meta: Meta<typeof MatchScoreCalculator> = { title: 'Components/MatchScoreCalculator', component: MatchScoreCalculator, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
