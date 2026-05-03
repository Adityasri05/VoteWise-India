import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HelpCenter from './HelpCenter';

describe('HelpCenter Component', () => {
  it('renders the main heading', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/Help Center/i)).toBeInTheDocument();
  });

  it('renders support cards', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/1950 Helpline/i)).toBeInTheDocument();
    expect(screen.getByText(/File a Complaint/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Support/i)).toBeInTheDocument();
  });

  it('renders FAQ section', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('renders all FAQ items', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/How do I check if my name is in the voter list/i)).toBeInTheDocument();
    expect(screen.getByText(/What if I lost my physical Voter ID card/i)).toBeInTheDocument();
  });

  it('renders download guide CTA', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/Download Guide/i)).toBeInTheDocument();
  });

  it('renders voter helpline answer', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/call the Voter Helpline at 1950/i)).toBeInTheDocument();
  });
});
