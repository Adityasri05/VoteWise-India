import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

vi.mock('./src/context/LanguageContext', () => ({
  useLanguage: () => ({
    t: new Proxy({}, { get: (target, prop) => prop }), // Returns the key as the string
    language: 'English',
    setLanguage: vi.fn(),
    languages: [{ name: 'English', code: 'en-IN' }]
  }),
  LanguageProvider: ({ children }) => React.createElement('div', null, children)
}));

