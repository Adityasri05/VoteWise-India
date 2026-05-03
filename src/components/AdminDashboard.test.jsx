import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard Component', () => {
  it('renders the dashboard overview header', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument();
  });

  it('displays all stat cards', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Queries/i)).toBeInTheDocument();
    expect(screen.getByText(/Booth Searches/i)).toBeInTheDocument();
    expect(screen.getByText(/Complaints/i)).toBeInTheDocument();
  });

  it('displays the admin sidebar navigation', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Voter Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('shows recent AI inquiries', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/How to apply for voter ID online/i)).toBeInTheDocument();
  });

  it('shows election alerts', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Nomination Deadline/i)).toBeInTheDocument();
    expect(screen.getByText(/Voter List Updated/i)).toBeInTheDocument();
  });
});
