const adapter = require('./helper/adapter-mongodb');

const project = 'MyApplication';
const domain = 'localhost';
const port = 3000;
const dbPath = 'mongodb://localhost:27017';
const oidcDb = 'oidc';

const clients = [
  { client_id: 'relying-party', client_secret: 'rp-secret', redirect_uris: ['https://localhost:3737'] },
  ];

let config = {
  project: project,
  domain: domain,
  port: port,
  dbPath: dbPath,
  adapter: adapter,
  clients: clients,
  oidcDb: oidcDb,
};

module.exports = config;

//{project, domain, port, database} = config