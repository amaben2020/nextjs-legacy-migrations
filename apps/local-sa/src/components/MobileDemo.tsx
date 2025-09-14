'use client';

import {
  useIsMobile,
  useBreakpoint,
} from '../../../../packages/mobile/dist/index.js';

export function MobileDemo() {
  const { isMobile, width, height } = useIsMobile();
  const {
    breakpoint,
    isMobile: isMobileBreakpoint,
    isTablet,
    isDesktop,
  } = useBreakpoint();

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Mobile Detection Demo</h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Screen Size:</span>
          <span className="text-sm text-gray-600">
            {width} × {height}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Is Mobile:</span>
          <span
            className={`px-2 py-1 rounded text-sm ${isMobile ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
          >
            {isMobile ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Breakpoint:</span>
          <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
            {breakpoint}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Device Type:</span>
          <span className="px-2 py-1 rounded text-sm bg-purple-100 text-purple-800">
            {isMobileBreakpoint
              ? 'Mobile'
              : isTablet
                ? 'Tablet'
                : isDesktop
                  ? 'Desktop'
                  : 'Unknown'}
          </span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          This component demonstrates the <code>useIsMobile</code> and{' '}
          <code>useBreakpoint</code> hooks from the <code>@repo/mobile</code>{' '}
          package.
        </p>
        <p>Try resizing your browser window to see the values change!</p>
      </div>
    </div>
  );
}
