import { Construct } from 'constructs';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface HelloConstructProps {
  bucketName?: string;
  removalPolicy?: RemovalPolicy;
}

export class HelloConstruct extends Construct {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props?: HelloConstructProps) {
    super(scope, id);

    this.bucket = new Bucket(this, 'HelloBucket', {
      bucketName: props?.bucketName,
      removalPolicy: props?.removalPolicy ?? RemovalPolicy.RETAIN,
      versioned: true,
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
    } as BucketProps);
  }
}