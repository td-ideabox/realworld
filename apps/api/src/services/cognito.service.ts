import { singleton } from "tsyringe";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AttributeType,
  AuthFlowType,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";

export interface CognitoUser {
  sub: string;
  email: string;
  username: string;
  bio?: string;
  image?: string;
}

export interface CognitoAuthResult {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  user: CognitoUser;
}

export interface ICognitoService {
  registerUser(username: string, email: string, password: string): Promise<CognitoUser>;
  loginUser(email: string, password: string): Promise<CognitoAuthResult>;
  getUserByEmail(email: string): Promise<CognitoUser | null>;
  updateUserProfile(email: string, updates: Partial<Pick<CognitoUser, 'bio' | 'image' | 'username'>>): Promise<CognitoUser>;
}

@singleton()
export class CognitoService implements ICognitoService {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });

    this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
    this.clientId = process.env.COGNITO_CLIENT_ID!;
    this.clientSecret = process.env.COGNITO_CLIENT_SECRET!;

    if (!this.userPoolId || !this.clientId || !this.clientSecret) {
      throw new Error('Missing required Cognito configuration');
    }
  }

  async registerUser(username: string, email: string, password: string): Promise<CognitoUser> {
    try {
      // Create user in Cognito
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: email, // Use email as username in Cognito
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'preferred_username', Value: username },
        ],
        MessageAction: MessageActionType.SUPPRESS, // Don't send welcome email
        TemporaryPassword: password,
      });

      const createResult = await this.client.send(createUserCommand);

      // Set permanent password
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: email,
        Password: password,
        Permanent: true,
      });

      await this.client.send(setPasswordCommand);

      const userSub = createResult.User?.Attributes?.find(attr => attr.Name === 'sub')?.Value;

      if (!userSub) {
        throw new Error('Failed to get user sub from Cognito');
      }

      return {
        sub: userSub,
        email,
        username,
        bio: undefined,
        image: undefined,
      };
    } catch (error: any) {
      if (error.name === 'UsernameExistsException') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<CognitoAuthResult> {
    try {
      const authCommand = new AdminInitiateAuthCommand({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: this.calculateSecretHash(email),
        },
      });

      const authResult = await this.client.send(authCommand);

      if (!authResult.AuthenticationResult) {
        throw new Error('Authentication failed');
      }

      const { AccessToken, IdToken, RefreshToken } = authResult.AuthenticationResult;

      if (!AccessToken || !IdToken || !RefreshToken) {
        throw new Error('Missing tokens in authentication result');
      }

      // Get user details
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found after authentication');
      }

      return {
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
        user,
      };
    } catch (error: any) {
      if (error.name === 'NotAuthorizedException') {
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<CognitoUser | null> {
    try {
      const getUserCommand = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: email,
      });

      const result = await this.client.send(getUserCommand);

      if (!result.UserAttributes) {
        return null;
      }

      const attributes = this.parseUserAttributes(result.UserAttributes);

      return {
        sub: attributes.sub || '',
        email: attributes.email || '',
        username: attributes.preferred_username || attributes.email || '',
        bio: attributes['custom:bio'],
        image: attributes['custom:image'],
      };
    } catch (error: any) {
      if (error.name === 'UserNotFoundException') {
        return null;
      }
      throw error;
    }
  }

  async updateUserProfile(email: string, updates: Partial<Pick<CognitoUser, 'bio' | 'image' | 'username'>>): Promise<CognitoUser> {
    try {
      const attributes: AttributeType[] = [];

      if (updates.username) {
        attributes.push({ Name: 'preferred_username', Value: updates.username });
      }
      if (updates.bio !== undefined) {
        attributes.push({ Name: 'custom:bio', Value: updates.bio || '' });
      }
      if (updates.image !== undefined) {
        attributes.push({ Name: 'custom:image', Value: updates.image || '' });
      }

      if (attributes.length > 0) {
        const updateCommand = new AdminUpdateUserAttributesCommand({
          UserPoolId: this.userPoolId,
          Username: email,
          UserAttributes: attributes,
        });

        await this.client.send(updateCommand);
      }

      // Return updated user
      const updatedUser = await this.getUserByEmail(email);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  private calculateSecretHash(username: string): string {
    const crypto = require('crypto');
    const message = username + this.clientId;
    return crypto.createHmac('sha256', this.clientSecret).update(message).digest('base64');
  }

  private parseUserAttributes(attributes: AttributeType[]): Record<string, string> {
    const parsed: Record<string, string> = {};

    for (const attr of attributes) {
      if (attr.Name && attr.Value) {
        parsed[attr.Name] = attr.Value;
      }
    }

    return parsed;
  }
}