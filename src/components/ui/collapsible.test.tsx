import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

describe('Collapsible', () => {
  it('renders trigger and content', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  it('toggles content visibility', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByText('Toggle');
    fireEvent.click(trigger);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('supports controlled state', () => {
    render(
      <Collapsible open={true}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Visible</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });
});
