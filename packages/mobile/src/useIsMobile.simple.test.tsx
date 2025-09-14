import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should return false for desktop width by default', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);
      expect(result.current.isMounted).toBe(true);
    });

    it('should return true for mobile width by default', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 600,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.width).toBe(600);
      expect(result.current.height).toBe(768);
    });

    it('should use custom breakpoint', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 900,
      });

      const { result } = renderHook(() => useIsMobile({ breakpoint: 1000 }));

      expect(result.current.isMobile).toBe(true);
    });

    it('should not be mobile when width equals breakpoint', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 768,
      });

      const { result } = renderHook(() => useIsMobile({ breakpoint: 768 }));

      expect(result.current.isMobile).toBe(false);
    });
  });

  describe('matchMedia integration', () => {
    it('should use matchMedia when enabled', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      renderHook(() => useIsMobile({ useMatchMedia: true }));

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    });

    it('should use custom media query when provided', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const customQuery = '(max-width: 500px) and (orientation: portrait)';
      renderHook(() => useIsMobile({ customQuery }));

      expect(mockMatchMedia).toHaveBeenCalledWith(customQuery);
    });

    it('should fallback to width comparison when matchMedia is disabled', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 600,
      });

      const { result } = renderHook(() =>
        useIsMobile({ useMatchMedia: false })
      );

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('SSR handling', () => {
    it('should handle server-side rendering', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result } = renderHook(() => useIsMobile());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.isMounted).toBe(true);

      global.window = originalWindow;
    });
  });

  describe('edge cases', () => {
    it('should handle zero breakpoint', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 100,
      });

      const { result } = renderHook(() => useIsMobile({ breakpoint: 0 }));

      expect(result.current.isMobile).toBe(false);
    });

    it('should handle negative breakpoint', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 100,
      });

      const { result } = renderHook(() => useIsMobile({ breakpoint: -100 }));

      expect(result.current.isMobile).toBe(false);
    });

    it('should handle very large breakpoint', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 2000,
      });

      const { result } = renderHook(() => useIsMobile({ breakpoint: 3000 }));

      expect(result.current.isMobile).toBe(true);
    });
  });
});
