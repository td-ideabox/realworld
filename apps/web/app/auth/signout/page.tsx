'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthSignout() {
  const router = useRouter();

  useEffect(() => {
    // Clear any local storage items related to auth
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to home after a brief delay
    const timeout = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12 text-center">
            <h2>You have been signed out</h2>
            <p>Thank you for using Conduit. You have been successfully signed out.</p>
            <p>
              <Link href="/login" className="btn btn-outline-primary">
                Sign in again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}