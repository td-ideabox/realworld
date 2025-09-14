import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HelloConstruct } from '../constructs/Hello.construct';

export interface HelloStackProps extends StackProps {
  bucketName?: string;
}

export class HelloStack extends Stack {
  public readonly helloConstruct: HelloConstruct;

  constructor(scope: Construct, id: string, props?: HelloStackProps) {
    super(scope, id, props);

    this.helloConstruct = new HelloConstruct(this, 'Hello', {
      bucketName: props?.bucketName,
    });
  }
}