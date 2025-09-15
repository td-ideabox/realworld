export const ENVIRONMENTS = {
  PRODUCTION: {
    COGNITO_DOMAIN: 'https://conduit-auth.auth.us-west-2.amazoncognito.com',
    COGNITO_CLIENT_ID: '3199iho7ia7k09h8aileg48h8k',
    COGNITO_USER_POOL_ID: 'us-west-2_29CK1YFJe',
    COGNITO_REGION: 'us-west-2',
    OIDC_ISSUER: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_29CK1YFJe',
    REDIRECT_URI: 'http://localhost:3000/auth/callback',
    POST_LOGOUT_REDIRECT_URI: 'http://localhost:3000/auth/signout',
  },
  DEVELOPMENT: {
    COGNITO_DOMAIN: 'https://conduit-auth.auth.us-west-2.amazoncognito.com',
    COGNITO_CLIENT_ID: '3199iho7ia7k09h8aileg48h8k',
    COGNITO_USER_POOL_ID: 'us-west-2_29CK1YFJe',
    COGNITO_REGION: 'us-west-2',
    OIDC_ISSUER: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_29CK1YFJe',
    REDIRECT_URI: 'http://localhost:3000/auth/callback',
    POST_LOGOUT_REDIRECT_URI: 'http://localhost:3000/auth/signout',
  },
};

export const getCurrentEnvironment = () => {
  return process.env.NODE_ENV === 'production' ? ENVIRONMENTS.PRODUCTION : ENVIRONMENTS.DEVELOPMENT;
};