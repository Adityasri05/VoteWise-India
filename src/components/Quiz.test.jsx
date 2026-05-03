import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Quiz from './Quiz';

describe('Quiz Component', () => {
  it('renders first question', () => {
    render(<Quiz />);
    expect(screen.getByText(/What is the minimum age to register as a voter in India\?/i)).toBeInTheDocument();
  });
});
