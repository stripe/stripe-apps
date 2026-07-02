import type { ComponentType } from "react";

import { QueryProvider } from "./QueryProvider";

export function withAppProviders<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  return function ViewWithProviders(props: P) {
    return (
      <QueryProvider>
        <Component {...props} />
      </QueryProvider>
    );
  };
}
