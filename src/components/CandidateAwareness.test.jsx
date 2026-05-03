import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CandidateAwareness from './CandidateAwareness';

describe('CandidateAwareness Component', () => {
  it('renders page header', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText(/Know Your Candidates/i)).toBeInTheDocument();
  });

  it('renders all candidate cards', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText('Aditi Sharma')).toBeInTheDocument();
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
    expect(screen.getByText('Meera Deshmukh')).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('No Criminal Records')).toBeInTheDocument();
  });

  it('renders manifesto section for each candidate', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText(/Focus on digital infrastructure/i)).toBeInTheDocument();
    expect(screen.getByText(/Strengthening rural economy/i)).toBeInTheDocument();
  });

  it('displays candidate info like assets and education', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText('PhD in Economics')).toBeInTheDocument();
    expect(screen.getByText('₹5.2 Crores')).toBeInTheDocument();
  });

  it('shows compare candidates section', () => {
    render(<CandidateAwareness />);
    expect(screen.getByText(/Compare Candidates/i)).toBeInTheDocument();
  });

  it('clicking a filter button changes its state', () => {
    render(<CandidateAwareness />);
    const filterBtn = screen.getByText('No Criminal Records');
    fireEvent.click(filterBtn);
    expect(filterBtn).toHaveClass('active');
  });
});
