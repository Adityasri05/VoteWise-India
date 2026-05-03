import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BoothLocator from './BoothLocator';

// Mock google maps
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }) => <div>{children}</div>,
  Map: ({ children }) => <div data-testid="mock-map">{children}</div>,
  AdvancedMarker: () => <div />,
  InfoWindow: () => <div />,
  useMap: () => ({ panTo: vi.fn(), setZoom: vi.fn() }),
  useMapsLibrary: () => null,
}));

describe('BoothLocator Component', () => {
  it('renders search input and map area', () => {
    render(<BoothLocator />);
    expect(screen.getByPlaceholderText(/Enter locality/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
  });
});
