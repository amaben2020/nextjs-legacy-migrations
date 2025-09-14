import { renderHook } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint.js';

// Mock window object
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Mock window globally
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

describe('useBreakpoint - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window properties
    mockWindow.innerWidth = 1024;
    mockWindow.innerHeight = 768;
  });

  it('should return lg breakpoint for 1024px width', () => {
    mockWindow.innerWidth = 1024;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('lg');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('should return sm breakpoint for 640px width', () => {
    mockWindow.innerWidth = 640;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('sm');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should return md breakpoint for 768px width', () => {
    mockWindow.innerWidth = 768;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('md');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should return xs breakpoint for very small width', () => {
    mockWindow.innerWidth = 100;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('xs');
    expect(result.current.isMobile).toBe(true);
  });

  it('should return 2xl breakpoint for very large width', () => {
    mockWindow.innerWidth = 1600;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('2xl');
    expect(result.current.isDesktop).toBe(true);
  });

  it('should use custom breakpoints', () => {
    const customBreakpoints = {
      xs: 0,
      sm: 500,
      md: 800,
      lg: 1200,
      xl: 1500,
      '2xl': 2000,
    };

    mockWindow.innerWidth = 600;
    const { result } = renderHook(() =>
      useBreakpoint({ breakpoints: customBreakpoints })
    );

    expect(result.current.breakpoint).toBe('sm');
  });

  it('should handle edge case at exact breakpoint', () => {
    const customBreakpoints = {
      xs: 0,
      sm: 500,
      md: 800,
      lg: 1200,
      xl: 1500,
      '2xl': 2000,
    };

    mockWindow.innerWidth = 500;
    const { result } = renderHook(() =>
      useBreakpoint({ breakpoints: customBreakpoints })
    );

    expect(result.current.breakpoint).toBe('sm');
  });

  it('should handle server-side rendering', () => {
    // Mock SSR environment
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('lg');
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    expect(result.current.isMounted).toBe(false);

    // Restore window
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });
  });

  it('should return correct width and height', () => {
    mockWindow.innerWidth = 1200;
    mockWindow.innerHeight = 900;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(900);
  });
});
