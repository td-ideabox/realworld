import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthConstruct } from '../constructs/Auth.construct';

export interface AuthStackProps extends StackProps {
  domainPrefix: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class AuthStack extends Stack {
  public readonly auth: AuthConstruct;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    this.auth = new AuthConstruct(this, 'Auth', {
      domainPrefix: props.domainPrefix,
      callbackUrls: props.callbackUrls,
      logoutUrls: props.logoutUrls,
    });
  }
}