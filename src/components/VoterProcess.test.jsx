import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VoterProcess from './VoterProcess';

describe('VoterProcess Component', () => {
  it('renders the page header', () => {
    render(<VoterProcess />);
    expect(screen.getByText(/The Voter Journey/i)).toBeInTheDocument();
  });

  it('renders all four process steps', () => {
    render(<VoterProcess />);
    expect(screen.getByText(/Check Your Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Register as a New Voter/i)).toBeInTheDocument();
    expect(screen.getByText(/Correct or Update Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Download digital e-EPIC/i)).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<VoterProcess />);
    expect(screen.getByText(/passport-sized photo/i)).toBeInTheDocument();
  });

  it('renders external links for each step', () => {
    render(<VoterProcess />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('renders the info card about voting without ID', () => {
    render(<VoterProcess />);
    expect(screen.getByText(/Voting Without a Physical ID/i)).toBeInTheDocument();
  });

  it('renders the Explore Valid IDs button', () => {
    render(<VoterProcess />);
    expect(screen.getByText(/Explore Valid IDs/i)).toBeInTheDocument();
  });
});
