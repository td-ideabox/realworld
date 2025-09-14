import { RouterProvider as TanStackRouterProvider } from "@tanstack/react-router";
import { router } from "./router";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function RouterProvider() {
  return <TanStackRouterProvider router={router} />;
}
