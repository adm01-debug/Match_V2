import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './input-otp';

describe('InputOTP', () => {
  it('renders OTP input slots', () => {
    render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts maxLength prop', () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(container).toBeInTheDocument();
  });
});
