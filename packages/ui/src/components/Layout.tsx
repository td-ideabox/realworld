"use client";

import { useRouter } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      <Header
        onHomeClick={() => handleNavigation("/")}
        onLoginClick={() => handleNavigation("/login")}
        onRegisterClick={() => handleNavigation("/register")}
        onNewArticleClick={() => handleNavigation("/editor")}
        onSettingsClick={() => handleNavigation("/settings")}
      />
      {children}
      <Footer onLogoClick={() => handleNavigation("/")} />
    </div>
  );
}