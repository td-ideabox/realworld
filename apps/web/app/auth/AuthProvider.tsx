'use client';

import { AuthProvider as OIDCAuthProvider, AuthProviderProps } from 'react-oidc-context';
import { getCurrentEnvironment } from '../environments';

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const env = getCurrentEnvironment();

  const oidcConfig: AuthProviderProps = {
    authority: env.OIDC_ISSUER,
    client_id: env.COGNITO_CLIENT_ID,
    redirect_uri: env.REDIRECT_URI,
    post_logout_redirect_uri: env.POST_LOGOUT_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    automaticSilentRenew: true,
    loadUserInfo: true,
    onSigninCallback: () => {
      // Remove the query parameters from the URL after successful sign-in
      window.history.replaceState(null, '', window.location.pathname);
    },
    onSignoutCallback: () => {
      // Redirect to home page after sign out
      window.location.href = '/';
    },
  };

  return (
    <OIDCAuthProvider {...oidcConfig}>
      {children}
    </OIDCAuthProvider>
  );
}