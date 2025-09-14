import { renderHook } from '@testing-library/react';
import { useIsMobile } from './useIsMobile.js';

// Mock window object
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  matchMedia: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Mock window globally
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

describe('useIsMobile - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window properties
    mockWindow.innerWidth = 1024;
    mockWindow.innerHeight = 768;
  });

  it('should return false for desktop width by default', () => {
    mockWindow.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should return true for mobile width by default', () => {
    mockWindow.innerWidth = 600;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.width).toBe(600);
    expect(result.current.height).toBe(768);
  });

  it('should use custom breakpoint', () => {
    mockWindow.innerWidth = 900;
    const { result } = renderHook(() => useIsMobile({ breakpoint: 1000 }));

    expect(result.current.isMobile).toBe(true);
  });

  it('should not be mobile when width equals breakpoint', () => {
    mockWindow.innerWidth = 768;
    const { result } = renderHook(() => useIsMobile({ breakpoint: 768 }));

    expect(result.current.isMobile).toBe(false);
  });

  it('should handle server-side rendering', () => {
    // Mock SSR environment
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    expect(result.current.isMounted).toBe(false);

    // Restore window
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });
  });

  it('should use matchMedia when enabled', () => {
    const mockMediaQueryList = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockWindow.matchMedia = vi.fn().mockReturnValue(mockMediaQueryList);
    mockWindow.innerWidth = 600;

    const { result } = renderHook(() => useIsMobile({ useMatchMedia: true }));

    expect(result.current.isMobile).toBe(true);
    expect(mockWindow.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('should fallback to width comparison when matchMedia is disabled', () => {
    mockWindow.innerWidth = 600;
    const { result } = renderHook(() => useIsMobile({ useMatchMedia: false }));

    expect(result.current.isMobile).toBe(true);
    expect(mockWindow.matchMedia).not.toHaveBeenCalled();
  });
});
