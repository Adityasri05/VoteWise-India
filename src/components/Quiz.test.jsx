import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from './Quiz';

describe('Quiz Component', () => {
  it('renders first question', () => {
    render(<Quiz />);
    expect(screen.getByText(/What is the minimum age to register as a voter in India\?/i)).toBeInTheDocument();
  });

  it('displays all four answer options', () => {
    render(<Quiz />);
    expect(screen.getByText('16 years')).toBeInTheDocument();
    expect(screen.getByText('18 years')).toBeInTheDocument();
    expect(screen.getByText('21 years')).toBeInTheDocument();
    expect(screen.getByText('25 years')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<Quiz />);
    expect(screen.getByText(/Question 1 of 4/i)).toBeInTheDocument();
  });

  it('highlights correct answer on click', () => {
    render(<Quiz />);
    const correctBtn = screen.getByText('18 years');
    fireEvent.click(correctBtn);
    // After clicking, button should get 'correct' class
    expect(correctBtn.closest('button')).toHaveClass('correct');
  });

  it('highlights incorrect answer on click', () => {
    render(<Quiz />);
    const wrongBtn = screen.getByText('16 years');
    fireEvent.click(wrongBtn);
    expect(wrongBtn.closest('button')).toHaveClass('incorrect');
  });

  it('disables options after answer selection', () => {
    render(<Quiz />);
    const btn = screen.getByText('18 years');
    fireEvent.click(btn);
    // All buttons should be disabled
    const allBtns = screen.getAllByRole('button');
    allBtns.forEach(b => {
      expect(b).toBeDisabled();
    });
  });
});
