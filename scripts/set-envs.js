/*
* * Para ejecutar el siguiente script que recontruye los archivos environment
* * - npm i -D dotenv
* * - node ./scripts/set-envs.js
*/

const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath    = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';


const baseUrl = process.env.BASE_URL;

if(!baseUrl) {
  throw new Error('base Url is Not Set')
}

//Configuracion variable de entorno (.env)
const envFileContent = `
  export const environment = {
    baseUrl : "${ baseUrl }"
  };
`;

mkdirSync('./src/environments',{ recursive : true });

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
