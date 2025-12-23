import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Components/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {},
  parameters: {
    mockData: { loading: true },
  },
};

export const WithError: Story = {
  args: {},
  parameters: {
    mockData: { error: 'Erro ao carregar dados' },
  },
};

export const Empty: Story = {
  args: {},
  parameters: {
    mockData: { data: [] },
  },
};
