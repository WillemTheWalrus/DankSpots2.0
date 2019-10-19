import { Injectable } from '@angular/core';

const awsCognitoRegion = 'us-west-2';
const awsUserPoolsId = 'us-west-2_ZRcqSgYNd';
const awsClientId = '8f6qn2j3v9tloe94fn7t9j0f4';
const awsIdpURL = 'cognito-idp.us-west-2.amazonaws.com/2309a760-c000-4f5a-8d8c-11191ea08d2e';
const awsIdentityPool = 'us-west-2:2309a760-c000-4f5a-8d8c-11191ea08d2e';
// const aws_cloud_logic_custom;

@Injectable()
export class AwsConfig {
  public load() {
    // const awsCloudLogicCustomObj = JSON.parse(aws_cloud_logic_custom);
    return {
      region: awsCognitoRegion, // region you are deploying (all lower caps, e.g: us-east-1)
      userPoolId: awsUserPoolsId, // your user pool ID
      appId: awsClientId, // your user pool app ID
      idpURL: awsIdpURL, // cognito idp url
      identityPool: awsIdentityPool, // your federated identity pool ID
      // APIs: awsCloudLogicCustomObj.reduce((m, v) => { m[v.name] = v.endpoint; return m; }, {})
    };
  }
}
