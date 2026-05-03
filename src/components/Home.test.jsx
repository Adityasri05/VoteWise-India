import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  it('renders hero section correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Next-Gen Election Assistant/i)).toBeInTheDocument();
  });

  it('renders the journey cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Find Booth/i)).toBeInTheDocument();
  });
});
