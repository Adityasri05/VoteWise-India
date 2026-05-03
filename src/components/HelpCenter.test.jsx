import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HelpCenter from './HelpCenter';

describe('HelpCenter Component', () => {
  it('renders correctly', () => {
    render(<HelpCenter />);
    expect(screen.getByText(/Help & Support/i)).toBeInTheDocument();
  });
});
