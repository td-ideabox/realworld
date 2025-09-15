'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12 text-center">
              <h2>Loading...</h2>
              <p>Checking authentication status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return fallback || (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12 text-center">
              <h2>Access Denied</h2>
              <p>You need to sign in to access this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}