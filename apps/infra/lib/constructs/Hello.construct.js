"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloConstruct = void 0;
const constructs_1 = require("constructs");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class HelloConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.bucket = new aws_s3_1.Bucket(this, 'HelloBucket', {
            bucketName: props?.bucketName,
            removalPolicy: props?.removalPolicy ?? aws_cdk_lib_1.RemovalPolicy.RETAIN,
            versioned: true,
            publicReadAccess: false,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
        });
    }
}
exports.HelloConstruct = HelloConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVsbG8uY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnN0cnVjdHMvSGVsbG8uY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF1QztBQUN2QywrQ0FBeUQ7QUFDekQsNkNBQTRDO0FBTzVDLE1BQWEsY0FBZSxTQUFRLHNCQUFTO0lBRzNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDNUMsVUFBVSxFQUFFLEtBQUssRUFBRSxVQUFVO1lBQzdCLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxJQUFJLDJCQUFhLENBQUMsTUFBTTtZQUMzRCxTQUFTLEVBQUUsSUFBSTtZQUNmLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixpQkFBaUIsRUFBRSxJQUFJO2dCQUN2QixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixxQkFBcUIsRUFBRSxJQUFJO2FBQzVCO1NBQ2EsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQW5CRCx3Q0FtQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJ1Y2tldCwgQnVja2V0UHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSB9IGZyb20gJ2F3cy1jZGstbGliJztcblxuZXhwb3J0IGludGVyZmFjZSBIZWxsb0NvbnN0cnVjdFByb3BzIHtcbiAgYnVja2V0TmFtZT86IHN0cmluZztcbiAgcmVtb3ZhbFBvbGljeT86IFJlbW92YWxQb2xpY3k7XG59XG5cbmV4cG9ydCBjbGFzcyBIZWxsb0NvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXQ6IEJ1Y2tldDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IEhlbGxvQ29uc3RydWN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5idWNrZXQgPSBuZXcgQnVja2V0KHRoaXMsICdIZWxsb0J1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IHByb3BzPy5idWNrZXROYW1lLFxuICAgICAgcmVtb3ZhbFBvbGljeTogcHJvcHM/LnJlbW92YWxQb2xpY3kgPz8gUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgICB2ZXJzaW9uZWQ6IHRydWUsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiB7XG4gICAgICAgIGJsb2NrUHVibGljQWNsczogdHJ1ZSxcbiAgICAgICAgYmxvY2tQdWJsaWNQb2xpY3k6IHRydWUsXG4gICAgICAgIGlnbm9yZVB1YmxpY0FjbHM6IHRydWUsXG4gICAgICAgIHJlc3RyaWN0UHVibGljQnVja2V0czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSBhcyBCdWNrZXRQcm9wcyk7XG4gIH1cbn0iXX0=