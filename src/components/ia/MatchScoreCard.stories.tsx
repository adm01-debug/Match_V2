import type { Meta, StoryObj } from "@storybook/react";
import { MatchScoreCard } from "./MatchScoreCard";

const meta: Meta<typeof MatchScoreCard> = {
  title: "AI/MatchScoreCard",
  component: MatchScoreCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MatchScoreCard>;

export const StrongMatch: Story = {
  args: {
    match: {
      score: 92,
      breakdown: {
        skillsMatch: 95,
        experienceMatch: 90,
        educationMatch: 85,
        locationMatch: 100,
        salaryMatch: 90,
      },
      highlights: [
        "✓ 5+ anos de experiência em React",
        "✓ Especialista em TypeScript",
        "✓ Experiência com liderança técnica",
      ],
      gaps: [],
      recommendation: "strong",
    },
  },
};

export const ModerateMatch: Story = {
  args: {
    match: {
      score: 68,
      breakdown: {
        skillsMatch: 70,
        experienceMatch: 60,
        educationMatch: 80,
        locationMatch: 100,
        salaryMatch: 50,
      },
      highlights: [
        "✓ Conhecimento em React",
        "✓ Formação em Computação",
      ],
      gaps: [
        "✗ Pouca experiência com TypeScript",
        "✗ Sem experiência em liderança",
      ],
      recommendation: "moderate",
    },
  },
};

export const WeakMatch: Story = {
  args: {
    match: {
      score: 35,
      breakdown: {
        skillsMatch: 30,
        experienceMatch: 40,
        educationMatch: 50,
        locationMatch: 100,
        salaryMatch: 20,
      },
      highlights: [
        "✓ Disponibilidade imediata",
      ],
      gaps: [
        "✗ Não possui experiência em React",
        "✗ Sem conhecimento em TypeScript",
        "✗ Experiência insuficiente",
        "✗ Pretensão salarial acima do range",
      ],
      recommendation: "weak",
    },
  },
};
