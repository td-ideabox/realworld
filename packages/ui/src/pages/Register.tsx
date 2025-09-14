'use client';

import Link from "next/link";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentEnvironment } from "../../../../apps/web/app/environments";

export function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const env = getCurrentEnvironment();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/');
    }
  }, [auth.isAuthenticated, router]);

  const handleSignUp = () => {
    const signupUrl = `${env.COGNITO_DOMAIN}/signup?client_id=${env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(env.REDIRECT_URI)}`;
    window.location.href = signupUrl;
  };

  if (auth.isLoading) {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12 text-center">
              <h2>Loading...</h2>
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
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link href="/login">Have an account?</Link>
            </p>

            <div className="text-xs-center">
              <button
                className="btn btn-lg btn-primary"
                onClick={handleSignUp}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Sign up for Conduit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
