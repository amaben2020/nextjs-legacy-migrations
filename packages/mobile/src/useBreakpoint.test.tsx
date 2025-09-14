import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBreakpoint } from './useBreakpoint';

// Mock window dimensions
const mockInnerWidth = vi.fn();
const mockInnerHeight = vi.fn();

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: mockInnerWidth,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: mockInnerHeight,
});

// Mock addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
});

describe('useBreakpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInnerWidth.mockReturnValue(1024);
    mockInnerHeight.mockReturnValue(768);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('default breakpoints', () => {
    it('should return lg breakpoint for 1024px width', () => {
      mockInnerWidth.mockReturnValue(1024);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('lg');
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it('should return sm breakpoint for 640px width', () => {
      mockInnerWidth.mockReturnValue(640);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('sm');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    it('should return md breakpoint for 768px width', () => {
      mockInnerWidth.mockReturnValue(768);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('md');
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    it('should return xs breakpoint for very small width', () => {
      mockInnerWidth.mockReturnValue(100);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('xs');
      expect(result.current.isMobile).toBe(true);
    });

    it('should return 2xl breakpoint for very large width', () => {
      mockInnerWidth.mockReturnValue(2000);

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

      mockInnerWidth.mockReturnValue(600);

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

      mockInnerWidth.mockReturnValue(500);

      const { result } = renderHook(() =>
        useBreakpoint({ breakpoints: customBreakpoints })
      );

      expect(result.current.breakpoint).toBe('sm');
    });
  });

  describe('resize handling', () => {
    it('should listen for resize events by default', () => {
      renderHook(() => useBreakpoint());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should not listen for resize events when disabled', () => {
      renderHook(() => useBreakpoint({ listenToResize: false }));

      expect(mockAddEventListener).not.toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should update breakpoint on resize', () => {
      mockInnerWidth.mockReturnValue(1024);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.breakpoint).toBe('lg');

      // Simulate resize to mobile
      mockInnerWidth.mockReturnValue(600);

      act(() => {
        const resizeHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === 'resize'
        )?.[1];

        if (resizeHandler) {
          resizeHandler();
        }
      });

      expect(result.current.breakpoint).toBe('sm');
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useBreakpoint());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
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
      mockInnerWidth.mockReturnValue(1200);
      mockInnerHeight.mockReturnValue(900);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.width).toBe(1200);
      expect(result.current.height).toBe(900);
    });
  });
});
