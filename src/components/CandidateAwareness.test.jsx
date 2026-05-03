import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CandidateAwareness from './CandidateAwareness';

describe('CandidateAwareness Component', () => {
  it('renders correctly', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText(/Know Your Candidates/i)).toBeInTheDocument();
  });
});
