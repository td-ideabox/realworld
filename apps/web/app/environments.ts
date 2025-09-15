// Helper function to get dynamic callback URLs based on current origin
const getDynamicCallbackUrls = () => {
  if (typeof window !== 'undefined') {
    return {
      REDIRECT_URI: `${window.location.origin}/auth/callback`,
      POST_LOGOUT_REDIRECT_URI: `${window.location.origin}/auth/signout`,
    };
  }

  // Fallback for SSR - use environment variables or defaults
  const port = process.env.WEB_PORT || process.env.NEXT_PUBLIC_WEB_PORT || '3000';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`;

  return {
    REDIRECT_URI: `${baseUrl}/auth/callback`,
    POST_LOGOUT_REDIRECT_URI: `${baseUrl}/auth/signout`,
  };
};

export const ENVIRONMENTS = {
  PRODUCTION: {
    COGNITO_DOMAIN: 'https://conduit-auth.auth.us-west-2.amazoncognito.com',
    COGNITO_CLIENT_ID: '3199iho7ia7k09h8aileg48h8k',
    COGNITO_USER_POOL_ID: 'us-west-2_29CK1YFJe',
    COGNITO_REGION: 'us-west-2',
    OIDC_ISSUER: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_29CK1YFJe',
    // Production URLs should be static
    REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://your-domain.com/auth/callback',
    POST_LOGOUT_REDIRECT_URI: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || 'https://your-domain.com/auth/signout',
  },
  DEVELOPMENT: {
    COGNITO_DOMAIN: 'https://conduit-auth.auth.us-west-2.amazoncognito.com',
    COGNITO_CLIENT_ID: '3199iho7ia7k09h8aileg48h8k',
    COGNITO_USER_POOL_ID: 'us-west-2_29CK1YFJe',
    COGNITO_REGION: 'us-west-2',
    OIDC_ISSUER: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_29CK1YFJe',
    // Dynamic URLs for development
    ...getDynamicCallbackUrls(),
  },
};

export const getCurrentEnvironment = () => {
  return process.env.NODE_ENV === 'production' ? ENVIRONMENTS.PRODUCTION : ENVIRONMENTS.DEVELOPMENT;
};

// Auth mode configuration
export const getAuthMode = () => {
  // Check for explicit dev auth override
  if (process.env.NEXT_PUBLIC_USE_DEV_AUTH === 'true') {
    return 'dev';
  }

  // Check for local development
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FORCE_COGNITO) {
    return 'dev';
  }

  return 'cognito';
};

export const isDevAuthMode = () => getAuthMode() === 'dev';