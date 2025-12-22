import type { Meta, StoryObj } from '@storybook/react';
import { CompetenciaRating } from './CompetenciaRating';

const meta: Meta<typeof CompetenciaRating> = {
  title: 'Components/CompetenciaRating',
  component: CompetenciaRating,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
