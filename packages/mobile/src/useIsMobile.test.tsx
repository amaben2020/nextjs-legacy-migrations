import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from './useIsMobile';

// Mock window.matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock window dimensions
const mockInnerWidth = vi.fn();
const mockInnerHeight = vi.fn();

// Mock addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe('useIsMobile', () => {
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset window dimensions
    mockInnerWidth.mockReturnValue(1024);
    mockInnerHeight.mockReturnValue(768);

    // Setup mock media query list
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia.mockReturnValue(mockMediaQueryList);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic functionality', () => {
    it('should return false for desktop width by default', () => {
      mockInnerWidth.mockReturnValue(1024);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);
      expect(result.current.isMounted).toBe(true);
    });

    it('should return true for mobile width by default', () => {
      mockInnerWidth.mockReturnValue(600);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.width).toBe(600);
      expect(result.current.height).toBe(768);
    });

    it('should use custom breakpoint', () => {
      mockInnerWidth.mockReturnValue(900);

      const { result } = renderHook(() => useIsMobile({ breakpoint: 1000 }));

      expect(result.current.isMobile).toBe(true);
    });

    it('should not be mobile when width equals breakpoint', () => {
      mockInnerWidth.mockReturnValue(768);

      const { result } = renderHook(() => useIsMobile({ breakpoint: 768 }));

      expect(result.current.isMobile).toBe(false);
    });
  });

  describe('matchMedia integration', () => {
    it('should use matchMedia when enabled', () => {
      mockInnerWidth.mockReturnValue(600);
      mockMediaQueryList.matches = true;

      renderHook(() => useIsMobile({ useMatchMedia: true }));

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    });

    it('should use custom media query when provided', () => {
      const customQuery = '(max-width: 500px) and (orientation: portrait)';
      mockMediaQueryList.matches = true;

      renderHook(() => useIsMobile({ customQuery }));

      expect(mockMatchMedia).toHaveBeenCalledWith(customQuery);
    });

    it('should fallback to width comparison when matchMedia is disabled', () => {
      mockInnerWidth.mockReturnValue(600);

      const { result } = renderHook(() =>
        useIsMobile({ useMatchMedia: false })
      );

      expect(result.current.isMobile).toBe(true);
      expect(mockMatchMedia).not.toHaveBeenCalled();
    });

    it('should handle matchMedia not being available', () => {
      // @ts-ignore
      delete window.matchMedia;
      mockInnerWidth.mockReturnValue(600);

      const { result } = renderHook(() => useIsMobile({ useMatchMedia: true }));

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('resize handling', () => {
    it('should listen for resize events by default', () => {
      renderHook(() => useIsMobile());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should not listen for resize events when disabled', () => {
      renderHook(() => useIsMobile({ listenToResize: false }));

      expect(mockAddEventListener).not.toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should update dimensions on resize', () => {
      mockInnerWidth.mockReturnValue(1024);

      const { result, rerender } = renderHook(() => useIsMobile());

      expect(result.current.width).toBe(1024);

      // Simulate resize
      mockInnerWidth.mockReturnValue(600);

      act(() => {
        // Get the resize handler that was registered
        const resizeHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === 'resize'
        )?.[1];

        if (resizeHandler) {
          resizeHandler();
        }
      });

      expect(result.current.width).toBe(600);
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('media query change handling', () => {
    it('should listen for media query changes when using matchMedia', () => {
      renderHook(() => useIsMobile({ useMatchMedia: true }));

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should update isMobile when media query changes', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsMobile({ useMatchMedia: true }));

      expect(result.current.isMobile).toBe(false);

      // Simulate media query change
      act(() => {
        const changeHandler =
          mockMediaQueryList.addEventListener.mock.calls.find(
            (call) => call[0] === 'change'
          )?.[1];

        if (changeHandler) {
          changeHandler({ matches: true } as MediaQueryListEvent);
        }
      });

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useIsMobile());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should cleanup only resize listener when not using matchMedia', () => {
      const { unmount } = renderHook(() =>
        useIsMobile({ useMatchMedia: false })
      );

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(mockMediaQueryList.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('SSR handling', () => {
    it('should handle server-side rendering', () => {
      // Mock server environment
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result } = renderHook(() => useIsMobile());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.isMounted).toBe(true);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('edge cases', () => {
    it('should handle zero breakpoint', () => {
      mockInnerWidth.mockReturnValue(100);

      const { result } = renderHook(() => useIsMobile({ breakpoint: 0 }));

      expect(result.current.isMobile).toBe(false);
    });

    it('should handle negative breakpoint', () => {
      mockInnerWidth.mockReturnValue(100);

      const { result } = renderHook(() => useIsMobile({ breakpoint: -100 }));

      expect(result.current.isMobile).toBe(false);
    });

    it('should handle very large breakpoint', () => {
      mockInnerWidth.mockReturnValue(2000);

      const { result } = renderHook(() => useIsMobile({ breakpoint: 3000 }));

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('performance', () => {
    it('should not create new functions on every render', () => {
      const { result, rerender } = renderHook(() => useIsMobile());

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // The hook should return the same object reference when values haven't changed
      expect(firstResult).toBe(secondResult);
    });
  });
});
