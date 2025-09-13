import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HelloConstruct } from '../constructs/Hello.construct';
export interface HelloStackProps extends StackProps {
    bucketName?: string;
}
export declare class HelloStack extends Stack {
    readonly helloConstruct: HelloConstruct;
    constructor(scope: Construct, id: string, props?: HelloStackProps);
}
//# sourceMappingURL=Hello.stack.d.ts.map