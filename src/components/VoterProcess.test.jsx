import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VoterProcess from './VoterProcess';

describe('VoterProcess Component', () => {
  it('renders all steps', () => {
    render(<VoterProcess />);
    expect(screen.getByText(/Check Your Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Register as a New Voter/i)).toBeInTheDocument();
  });
});
