import type { Meta, StoryObj } from "@storybook/react";
import { BulkSelectionBar } from "./BulkSelectionBar";

const meta: Meta<typeof BulkSelectionBar> = {
  title: "Common/BulkSelectionBar",
  component: BulkSelectionBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    entityType: {
      control: "select",
      options: ["candidatos", "vagas"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BulkSelectionBar>;

export const Default: Story = {
  args: {
    selectedCount: 5,
    totalCount: 100,
    isAllSelected: false,
    onSelectAll: () => {},
    onClearSelection: () => {},
    onAction: (action) => console.log("Action:", action),
    entityType: "candidatos",
  },
};

export const AllSelected: Story = {
  args: {
    selectedCount: 100,
    totalCount: 100,
    isAllSelected: true,
    onSelectAll: () => {},
    onClearSelection: () => {},
    onAction: () => {},
    entityType: "candidatos",
  },
};

export const Vagas: Story = {
  args: {
    selectedCount: 3,
    totalCount: 25,
    isAllSelected: false,
    onSelectAll: () => {},
    onClearSelection: () => {},
    onAction: () => {},
    entityType: "vagas",
  },
};
