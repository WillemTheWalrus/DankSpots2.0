import { Injectable } from '@angular/core';

const awsCognitoRegion = 'us-west-2';
const awsUserPoolsId = 'us-west-2_ZRcqSgYNd';
const awsClientId = '8f6qn2j3v9tloe94fn7t9j0f4';
const awsARN= 'arn:aws:cognito-idp:us-west-2:976810362444:userpool/us-west-2_ZRcqSgYNd'
// const aws_cognito_identity_pool_id;
// const aws_cloud_logic_custom;

@Injectable()
export class AwsConfig {
  public load() {
    // const awsCloudLogicCustomObj = JSON.parse(aws_cloud_logic_custom);
    return {
      region: awsCognitoRegion, // region you are deploying (all lower caps, e.g: us-east-1)
      userPoolId: awsUserPoolsId, // your user pool ID
      appId: awsClientId, // your user pool app ID
      idpURL: awsARN, // cognito idp url
      // identityPool: aws_cognito_identity_pool_id, // your federated identity pool ID
      // APIs: awsCloudLogicCustomObj.reduce((m, v) => { m[v.name] = v.endpoint; return m; }, {})
    };
  }
}
