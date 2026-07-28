import { routes } from "@/routes";
import { NavigationProvider } from "@stripe/ui-extension-sdk/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Force queries to always fetch fresh data on every render, and never cache results. This is useful for examples where we want to demonstrate the latest data without caching.
       * This enable us to see the loading state of pages.
       */
      staleTime: 0,
      gcTime: 0,
      retry: false,
    },
  },
});

export function withAppProviders<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  return function ViewWithProviders(props: P) {
    return (
      <NavigationProvider routes={routes}>
        <QueryClientProvider client={queryClient}>
          <Component {...props} />
        </QueryClientProvider>
      </NavigationProvider>
    );
  };
}
