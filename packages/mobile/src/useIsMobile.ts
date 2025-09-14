import { useState, useEffect, useCallback } from 'react';

export interface UseIsMobileOptions {
  /**
   * The breakpoint below which the device is considered mobile.
   * @default 768
   */
  breakpoint?: number;
  /**
   * Whether to use window.matchMedia for more accurate detection.
   * @default true
   */
  useMatchMedia?: boolean;
  /**
   * Custom media query for mobile detection.
   * If provided, this will be used instead of the breakpoint.
   */
  customQuery?: string;
  /**
   * Whether to listen for resize events to update the mobile state.
   * @default true
   */
  listenToResize?: boolean;
}

export interface UseIsMobileReturn {
  /**
   * Whether the current device/screen is considered mobile.
   */
  isMobile: boolean;
  /**
   * The current window width.
   */
  width: number;
  /**
   * The current window height.
   */
  height: number;
  /**
   * Whether the hook is currently mounted and active.
   */
  isMounted: boolean;
}

/**
 * A hook to detect if the current device/screen is mobile.
 *
 * @param options - Configuration options for the hook
 * @returns An object containing mobile state and window dimensions
 *
 * @example
 * ```tsx
 * import { useIsMobile } from '@repo/mobile';
 *
 * function MyComponent() {
 *   const { isMobile, width, height } = useIsMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? 'Mobile view' : 'Desktop view'}
 *       <p>Screen size: {width}x{height}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom breakpoint
 * const { isMobile } = useIsMobile({ breakpoint: 1024 });
 *
 * // With custom media query
 * const { isMobile } = useIsMobile({
 *   customQuery: '(max-width: 768px) and (orientation: portrait)'
 * });
 * ```
 */
export function useIsMobile(
  options: UseIsMobileOptions = {}
): UseIsMobileReturn {
  const {
    breakpoint = 768,
    useMatchMedia = true,
    customQuery,
    listenToResize = true,
  } = options;

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const w = window.innerWidth || 1024;
    return w < breakpoint;
  });
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return window.innerWidth || 1024;
  });
  const [height, setHeight] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight || 768;
  });
  const [isMounted, setIsMounted] = useState(false);

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    setWidth(newWidth);
    setHeight(newHeight);

    if (useMatchMedia && window.matchMedia) {
      const mediaQuery = customQuery || `(max-width: ${breakpoint - 1}px)`;
      const mediaQueryList = window.matchMedia(mediaQuery);
      setIsMobile(mediaQueryList?.matches || false);
    } else {
      setIsMobile(newWidth < breakpoint);
    }
  }, [breakpoint, useMatchMedia, customQuery]);

  useEffect(() => {
    // Set initial values
    updateDimensions();
    setIsMounted(true);

    if (!listenToResize) return;

    // Listen for resize events
    window.addEventListener('resize', updateDimensions);

    // If using matchMedia, also listen for media query changes
    if (useMatchMedia && window.matchMedia) {
      const mediaQuery = customQuery || `(max-width: ${breakpoint - 1}px)`;
      const mediaQueryList = window.matchMedia(mediaQuery);

      if (mediaQueryList) {
        const handleMediaChange = (e: MediaQueryListEvent) => {
          setIsMobile(e.matches);
        };

        mediaQueryList.addEventListener('change', handleMediaChange);

        return () => {
          window.removeEventListener('resize', updateDimensions);
          mediaQueryList.removeEventListener('change', handleMediaChange);
        };
      }
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [
    updateDimensions,
    listenToResize,
    useMatchMedia,
    customQuery,
    breakpoint,
  ]);

  return {
    isMobile,
    width,
    height,
    isMounted,
  };
}
