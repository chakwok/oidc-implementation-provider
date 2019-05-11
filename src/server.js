const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const Provider = require('oidc-provider');

const mongodbHelper = require('./helper/mongodb-helper');

const config = require('./config');

//Initialization
const {project, domain, port, dbPath, adapter, clients} = config;

// use this to share a connection, all connection comes from here
const dbHelper = new mongodbHelper(dbPath);



const configuration = {
  features: {
    claimsParameter: true,
    discovery: true,
  },
  findbyId: async function(){ //TODO

  },
  claims: { //TODO: config

  },
  interactionUrl(ctx) {
    return `/interaction/${ctx.oidc.uuid}`;
  },
  formats:{
    AccessToken: 'jwt',
  }
}

const oidc = new Provider(`https://${domain}`, configuration);

oidc.initialize({
  adapter: adapter,
  clients: clients,
}).then(() => {
  oidc.proxy = true;

  oidc.listen(port);
}).then(() => {
  const app = express();
  app.set('trust proxy', true);
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'views'));

  app.use(bodyParser());
  app.use(cors());



  // express listen
  app.listen(process.env.PORT || '3000'1);
});