import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import * as LanguageContext from '../context/LanguageContext';
import React from 'react';

// Mock Language Context
vi.spyOn(LanguageContext, 'useLanguage').mockReturnValue({
  t: {
    eligibility: 'Eligibility',
    registration: 'Registration',
    findBooth: 'Find Booth',
    castVote: 'Cast Vote',
    heroTitle: 'VoteWise Through AI Intelligence',
    heroDesc: 'Your personal digital assistant for a smarter democracy.',
    beginJourney: 'Begin Journey',
    locateStations: 'Locate Stations',
    digitalJourney: 'Digital Journey',
  }
});

describe('Home Component', () => {
  const renderHome = () => render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  it('renders hero section correctly', () => {
    renderHome();
    expect(screen.getByText(/Next-Gen Election Assistant/i)).toBeInTheDocument();
  });

  it('renders the journey cards', () => {
    renderHome();
    expect(screen.getByText(/Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Find Booth/i)).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    renderHome();
    expect(screen.getByText(/Begin Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Locate Stations/i)).toBeInTheDocument();
  });

  it('renders hero description', () => {
    renderHome();
    expect(screen.getByText(/Your personal digital assistant/i)).toBeInTheDocument();
  });

  it('renders all four journey steps', () => {
    renderHome();
    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByText('Find Booth')).toBeInTheDocument();
    expect(screen.getByText('Cast Vote')).toBeInTheDocument();
  });

  it('renders achievement badges section', () => {
    renderHome();
    expect(screen.getByText(/Early Voter/i)).toBeInTheDocument();
    expect(screen.getByText(/Policy Maven/i)).toBeInTheDocument();
    expect(screen.getByText(/Guardian/i)).toBeInTheDocument();
  });

  it('renders truth and clarity section', () => {
    renderHome();
    expect(screen.getByText(/POPULAR MYTH/i)).toBeInTheDocument();
    expect(screen.getByText(/VERIFIED FACT/i)).toBeInTheDocument();
  });

  it('renders certification quiz link', () => {
    renderHome();
    expect(screen.getByText(/Start Certification Quiz/i)).toBeInTheDocument();
  });

  it('has proper navigation links', () => {
    renderHome();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
