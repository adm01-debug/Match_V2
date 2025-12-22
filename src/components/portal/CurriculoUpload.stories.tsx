import type { Meta, StoryObj } from '@storybook/react';
import { CurriculoUpload } from './CurriculoUpload';
const meta: Meta<typeof CurriculoUpload> = { title: 'Components/CurriculoUpload', component: CurriculoUpload, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
