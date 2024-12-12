/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  hmr: false,
  baseAddress: 'http://localhost:5070/',
  baseadd :'http://localhost:4200/',
  // baseAddress: 'http://localhost:7000/',
  questionnaireBaseAddress: 'http://localhost:9011/',
  //  baseAddress: 'http://192.168.0.25:7000/',
  // baseAddress: 'http://172.17.2.27:7000/',
  // questionnaireBaseAddress: 'http://192.168.0.28:9022/',
  // baseAddress: 'http://localhost:60789/',
  clientId: 'ngAuthApp',
  AccountGroup:"ZMDM,ZFGD,ZCGD"
};
