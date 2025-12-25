import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { PageSuspense } from './PageSuspense';
import { Suspense, lazy } from 'react';

const meta: Meta<typeof PageSuspense> = {
  title: 'Common/PageSuspense',
  component: PageSuspense,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageSuspense>;

export const Default: Story = {
  render: () => (
    <PageSuspense>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p>This content is wrapped in Suspense</p>
      </div>
    </PageSuspense>
  ),

  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const CustomFallback: Story = {
  render: () => (
    <PageSuspense fallback={<div className="p-6 text-center">Custom Loading...</div>}>
      <div className="p-6">Page Content</div>
    </PageSuspense>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 p-6">
      <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
      <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="h-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-32 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  ),
};
