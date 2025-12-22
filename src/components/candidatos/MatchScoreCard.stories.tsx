import type { Meta, StoryObj } from '@storybook/react';
import { MatchScoreCard } from './MatchScoreCard';
const meta: Meta<typeof MatchScoreCard> = { title: 'Components/MatchScoreCard', component: MatchScoreCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
