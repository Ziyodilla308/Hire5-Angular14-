const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const environmentContent = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL}'
};
`;

fs.writeFileSync('src/environments/environments.ts', environmentContent);
