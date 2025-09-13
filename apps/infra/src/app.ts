#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { HelloStack } from './stacks/Hello.stack';

const app = new App();

new HelloStack(app, 'ConduitHelloStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
  },
  bucketName: 'conduit-hello-bucket',
});

app.synth();