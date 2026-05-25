import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as React from 'react';

vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual<any>('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      React.createElement(OriginalModule.ResponsiveContainer, { width: 800, height: 400 }, children)
    ),
  };
});
