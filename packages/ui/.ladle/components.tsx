import type { GlobalProvider } from "@ladle/react";

// Import global CSS for all stories - following Ladle documentation best practices
import "./global.css";

export const Provider: GlobalProvider = ({ children }) => {
  return <>{children}</>;
};