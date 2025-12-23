import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

describe('RadioGroup', () => {
  it('renders radio options', () => {
    render(
      <RadioGroup defaultValue="option1">
        <div>
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="option2" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
      </RadioGroup>
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('selects default value', () => {
    render(
      <RadioGroup defaultValue="opt1">
        <RadioGroupItem value="opt1" id="opt1" />
        <RadioGroupItem value="opt2" id="opt2" />
      </RadioGroup>
    );
    const radio = screen.getAllByRole('radio')[0];
    expect(radio).toBeChecked();
  });
});
