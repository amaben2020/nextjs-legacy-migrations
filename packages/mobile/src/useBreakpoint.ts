import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface UseBreakpointOptions {
  /**
   * Custom breakpoint values in pixels.
   * @default { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
   */
  breakpoints?: Record<Breakpoint, number>;
  /**
   * Whether to listen for resize events to update the breakpoint.
   * @default true
   */
  listenToResize?: boolean;
}

export interface UseBreakpointReturn {
  /**
   * The current breakpoint based on window width.
   */
  breakpoint: Breakpoint;
  /**
   * Whether the current breakpoint is mobile (xs or sm).
   */
  isMobile: boolean;
  /**
   * Whether the current breakpoint is tablet (md).
   */
  isTablet: boolean;
  /**
   * Whether the current breakpoint is desktop (lg, xl, or 2xl).
   */
  isDesktop: boolean;
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

const DEFAULT_BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * A hook to detect the current breakpoint based on window width.
 *
 * @param options - Configuration options for the hook
 * @returns An object containing breakpoint information and window dimensions
 *
 * @example
 * ```tsx
 * import { useBreakpoint } from '@repo/mobile';
 *
 * function MyComponent() {
 *   const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 *   return (
 *     <div>
 *       <p>Current breakpoint: {breakpoint}</p>
 *       {isMobile && <p>Mobile view</p>}
 *       {isTablet && <p>Tablet view</p>}
 *       {isDesktop && <p>Desktop view</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBreakpoint(
  options: UseBreakpointOptions = {}
): UseBreakpointReturn {
  const { breakpoints = DEFAULT_BREAKPOINTS, listenToResize = true } = options;

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'lg';
    const w = window.innerWidth || 1024;
    const sortedBreakpoints = Object.entries(breakpoints).sort(
      ([, a], [, b]) => b - a
    ) as [Breakpoint, number][];
    return sortedBreakpoints.find(([, bpWidth]) => w >= bpWidth)?.[0] || 'xs';
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

  const updateBreakpoint = useCallback(() => {
    if (typeof window === 'undefined') return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    setWidth(newWidth);
    setHeight(newHeight);

    // Find the appropriate breakpoint
    const sortedBreakpoints = Object.entries(breakpoints).sort(
      ([, a], [, b]) => b - a
    ) as [Breakpoint, number][];

    const currentBreakpoint =
      sortedBreakpoints.find(([, bpWidth]) => newWidth >= bpWidth)?.[0] || 'xs';
    setBreakpoint(currentBreakpoint);
  }, [breakpoints]);

  useEffect(() => {
    // Set initial values
    updateBreakpoint();
    setIsMounted(true);

    if (!listenToResize) return;

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, [updateBreakpoint, listenToResize]);

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop =
    breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
    isMounted,
  };
}
