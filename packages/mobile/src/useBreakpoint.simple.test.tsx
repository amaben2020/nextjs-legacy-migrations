import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBreakpoint } from './useBreakpoint';

describe('useBreakpoint - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('default breakpoints', () => {
    it('should return lg breakpoint for 1024px width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('lg');
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it('should return sm breakpoint for 640px width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 640,
      });

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('sm');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    it('should return md breakpoint for 768px width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 768,
      });

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('md');
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    it('should return xs breakpoint for very small width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 100,
      });

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('xs');
      expect(result.current.isMobile).toBe(true);
    });

    it('should return 2xl breakpoint for very large width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 2000,
      });

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('2xl');
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe('custom breakpoints', () => {
    it('should use custom breakpoints', () => {
      const customBreakpoints = {
        xs: 0,
        sm: 500,
        md: 800,
        lg: 1200,
        xl: 1600,
        '2xl': 2000,
      };

      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 600,
      });

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
        xl: 1600,
        '2xl': 2000,
      };

      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });

      const { result } = renderHook(() =>
        useBreakpoint({ breakpoints: customBreakpoints })
      );

      expect(result.current.breakpoint).toBe('sm');
    });
  });

  describe('SSR handling', () => {
    it('should handle server-side rendering', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('lg');
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.isMounted).toBe(true);

      global.window = originalWindow;
    });
  });

  describe('dimensions', () => {
    it('should return correct width and height', () => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.width).toBe(1200);
      expect(result.current.height).toBe(900);
    });
  });
});
