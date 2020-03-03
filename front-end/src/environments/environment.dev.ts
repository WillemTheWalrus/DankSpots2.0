// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    envName: 'dev',
    assetUrl: '/',
    baseApi: 'https://39lg8471i6.execute-api.us-west-2.amazonaws.com/Prod',
    imageBucket: 'https://dankimagebucket.s3-us-west-2.amazonaws.com/spot/image'
  };
