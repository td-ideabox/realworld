import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy, Duration } from 'aws-cdk-lib';
import {
  UserPool,
  UserPoolClient,
  UserPoolDomain,
  AccountRecovery,
  Mfa,
  SignInAliases,
  StandardAttributes,
  StandardAttribute,
  UserPoolClientIdentityProvider,
  OAuthScope,
  OAuthFlows,
} from 'aws-cdk-lib/aws-cognito';

export interface AuthConstructProps {
  domainPrefix: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class AuthConstruct extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;
  public readonly userPoolDomain: UserPoolDomain;

  constructor(scope: Construct, id: string, props: AuthConstructProps) {
    super(scope, id);

    // Create Cognito User Pool
    this.userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'ConduitUserPool',
      signInAliases: {
        email: true,
        username: false,
        phone: false,
      } as SignInAliases,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        } as StandardAttribute,
        givenName: {
          required: false,
          mutable: true,
        } as StandardAttribute,
        familyName: {
          required: false,
          mutable: true,
        } as StandardAttribute,
      } as StandardAttributes,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      mfa: Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      selfSignUpEnabled: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create User Pool Domain
    this.userPoolDomain = new UserPoolDomain(this, 'UserPoolDomain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: props.domainPrefix,
      },
    });

    // Create User Pool Client
    this.userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'ConduitWebClient',
      generateSecret: false,
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
      ],
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false,
        } as OAuthFlows,
        scopes: [
          OAuthScope.EMAIL,
          OAuthScope.OPENID,
          OAuthScope.PROFILE,
        ],
        callbackUrls: props.callbackUrls || ['http://localhost:3000/auth/callback'],
        logoutUrls: props.logoutUrls || ['http://localhost:3000/auth/signout'],
      },
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
    });

    // Output values for frontend configuration
    new CfnOutput(this, 'UserPoolIdOutput', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new CfnOutput(this, 'UserPoolClientIdOutput', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new CfnOutput(this, 'UserPoolDomainOutput', {
      value: `https://${props.domainPrefix}.auth.us-west-2.amazoncognito.com`,
      description: 'Cognito User Pool Domain URL',
    });

    new CfnOutput(this, 'OIDCIssuerOutput', {
      value: `https://cognito-idp.us-west-2.amazonaws.com/${this.userPool.userPoolId}`,
      description: 'OIDC Issuer URL',
    });
  }
}