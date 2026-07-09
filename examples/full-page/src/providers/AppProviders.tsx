import { routes } from "@/routes";
import { NavigationProvider } from "@stripe/ui-extension-sdk/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
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
