import { describe, it, expect, vi } from 'vitest';
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

  it('does not render when isOpen is false', () => {
    const { container } = render(<AuthModal isOpen={false} onClose={() => {}} />);
    expect(container.querySelector('.premium-auth-overlay')).not.toBeInTheDocument();
  });

  it('renders close button with aria-label', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('renders password input field', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('renders Google sign-in button', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
  });

  it('shows branding on left panel', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/VoteWise/i)).toBeInTheDocument();
  });
});
