'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Don't retry on 401/403 errors
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}