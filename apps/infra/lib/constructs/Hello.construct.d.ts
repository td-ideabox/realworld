import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
export interface HelloConstructProps {
    bucketName?: string;
    removalPolicy?: RemovalPolicy;
}
export declare class HelloConstruct extends Construct {
    readonly bucket: Bucket;
    constructor(scope: Construct, id: string, props?: HelloConstructProps);
}
//# sourceMappingURL=Hello.construct.d.ts.map