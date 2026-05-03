import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from './AuthModal';

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('AuthModal Component', () => {
  it('renders login view by default', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThan(0);
  });

  it('switches to sign up view when toggle is clicked', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    const toggleBtn = screen.getByText(/Create one now/i);
    fireEvent.click(toggleBtn);
    expect(screen.getAllByText(/Create Account/i).length).toBeGreaterThan(0);
  });
});
