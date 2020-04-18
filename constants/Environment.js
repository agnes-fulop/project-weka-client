export const ENV_VARIABLES = {
    dev: {
      apiUrl: 'https://4qs08efi8i.execute-api.ap-southeast-2.amazonaws.com/dev/v1/wekas',
      apiKey: '7pJgfpkrUb6gsOwAfSJFLG0OFU1OpCt7l7fYVMMg'
    },
    prod: {
      apiUrl: 'TBD',
      apiKey: 'TBD'
    }
  };

const env = 'dev'; // TODO: get this dynamically

export function getEnvVariables() {
  return (env === null || env === undefined || env === "" || env === 'dev') 
    ? ENV_VARIABLES.dev
    : ENV_VARIABLES.prod;
}