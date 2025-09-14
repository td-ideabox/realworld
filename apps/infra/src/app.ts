#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { HelloStack } from './stacks/Hello.stack';
import { AuthStack } from './stacks/Auth.stack';

const app = new App();

new HelloStack(app, 'ConduitHelloStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
  },
  bucketName: 'conduit-hello-bucket',
});

new AuthStack(app, 'ConduitAuthStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
  },
  domainPrefix: 'conduit-auth',
  callbackUrls: [
    'http://localhost:3000/auth/callback',
    'https://conduit.devswarm.com/auth/callback',
  ],
  logoutUrls: [
    'http://localhost:3000/auth/signout',
    'https://conduit.devswarm.com/auth/signout',
  ],
});

app.synth();