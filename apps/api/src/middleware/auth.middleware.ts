import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    username?: string;
    'cognito:username'?: string;
  };
}

export class AuthMiddleware {
  private jwksClient: jwksClient.JwksClient;
  private cognitoIssuer: string;
  private cognitoClientId: string;

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    this.cognitoClientId = process.env.COGNITO_CLIENT_ID || '';

    if (!userPoolId) {
      throw new Error('COGNITO_USER_POOL_ID environment variable is required');
    }

    this.cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    this.jwksClient = jwksClient({
      jwksUri: `${this.cognitoIssuer}/.well-known/jwks.json`,
      requestHeaders: {},
      timeout: 30000,
    });
  }

  private getKey = (header: any, callback: any) => {
    this.jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  };

  public authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);

      if (!token) {
        res.status(401).json({
          errors: { authentication: ['Missing or invalid authorization token'] }
        });
        return;
      }

      const decoded = await this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({
        errors: { authentication: ['Invalid or expired token'] }
      });
    }
  };

  public optional = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);

      if (token) {
        const decoded = await this.verifyToken(token);
        req.user = decoded;
      }

      next();
    } catch (error) {
      // For optional auth, we don't fail on invalid tokens, just continue without user
      next();
    }
  };

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1] || null;
  }

  private verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.getKey, {
        issuer: this.cognitoIssuer,
        audience: this.cognitoClientId,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }

        if (!decoded || typeof decoded === 'string') {
          reject(new Error('Invalid token payload'));
          return;
        }

        // Extract user information from Cognito token
        const userInfo = {
          sub: decoded.sub,
          email: decoded.email,
          username: decoded['cognito:username'] || decoded.username,
          'cognito:username': decoded['cognito:username']
        };

        resolve(userInfo);
      });
    });
  }
}