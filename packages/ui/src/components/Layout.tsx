"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const auth = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = () => {
    auth.signoutRedirect();
  };

  const getUsername = () => {
    return auth.user?.profile?.email?.split('@')[0] || 'User';
  };

  const getCurrentUser = () => {
    if (auth.isAuthenticated && auth.user?.profile) {
      return {
        username: getUsername(),
        image: auth.user.profile.picture,
      };
    }
    return null;
  };

  return (
    <div>
      <Header
        user={getCurrentUser()}
        onHomeClick={() => handleNavigation("/")}
        onLoginClick={() => handleNavigation("/login")}
        onRegisterClick={() => handleNavigation("/register")}
        onNewArticleClick={() => handleNavigation("/editor")}
        onSettingsClick={() => handleNavigation("/settings")}
        onProfileClick={() => handleNavigation(`/profile/${getUsername()}`)}
        onSignOutClick={handleSignOut}
      />
      {children}
      <Footer onLogoClick={() => handleNavigation("/")} />
    </div>
  );
}