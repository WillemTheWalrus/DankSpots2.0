import { Injectable } from '@angular/core';

const awsCognitoRegion = 'us-west-2';
const awsUserPoolsId = 'us-west-2_yrDUlOoHF';
const awsClientId = '2m0sls6hh9kl46m62vqbie4pnj';
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
