'use client';

import Link from "next/link";
import { useAuth } from "react-oidc-context";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signoutRedirect();
  };

  const getUsername = () => {
    return auth.user?.profile?.email?.split('@')[0] || 'User';
  };

  return (
    <div>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link href="/" className="navbar-brand">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>

            {auth.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link href="/editor" className="nav-link">
                    <i className="ion-compose"></i>&nbsp;New Article
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/settings" className="nav-link">
                    <i className="ion-gear-a"></i>&nbsp;Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href={`/profile/${getUsername()}`} className="nav-link">
                    <i className="ion-person"></i>&nbsp;{getUsername()}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleSignOut}
                    className="nav-link"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Sign in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      {children}
      <footer>
        <div className="container">
          <Link href="/" className="logo-font">
            conduit
          </Link>
          <span className="attribution">
            An interactive learning project from{" "}
            <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </div>
  );
}