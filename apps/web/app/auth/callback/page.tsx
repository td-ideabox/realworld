'use client';

import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/');
    } else if (auth.error) {
      console.error('Authentication error:', auth.error);
      router.replace('/login');
    }
  }, [auth.isAuthenticated, auth.error, router]);

  if (auth.isLoading) {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12 text-center">
              <h2>Signing you in...</h2>
              <p>Please wait while we complete your authentication.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12 text-center">
            <h2>Authentication Complete</h2>
            <p>Redirecting you to the application...</p>
          </div>
        </div>
      </div>
    </div>
  );
}