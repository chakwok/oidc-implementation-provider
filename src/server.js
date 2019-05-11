const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const Provider = require('oidc-provider');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongodbHelper = require('./helper/mongodb-helper');

const config = require('./config');

//Initialization
const {project, domain, port, dbPath, adapter, clients} = config;

// use this to share a connection, all connection comes from here
const dbHelper = new mongodbHelper(dbPath);



//oidc config
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

//starting the program
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

  app.get('/interaction/:grant', async (req, res) => {
    oidc.interactionDetails(req).then((details) => {
      console.log('see what else is available to you for interaction views', details);

      const view = (() => {
        switch (details.interaction.reason) {
          case 'consent_prompt':
          case 'client_not_authorized':
            return 'interaction';
          default:
            return 'login';
        }
      })();

      res.render(view, { details });
    });
  });

  app.post('/interaction/:grant/confirm', parse, (req, res) => {
    oidc.interactionFinished(req, res, {
      consent: {
        // TODO: add offline_access checkbox to confirm too
      },
    });
  });



  app.post('/interaction/:grant/login', parse, async (req, res, next) => {
    const accountId = await authenticate(req.body.emailOrUserName, req.body.password, res);

    oidc.interactionFinished(req, res, {
        login: {
          account: account.accountId,
          remember: !!req.body.remember,
          ts: Math.floor(Date.now() / 1000),
        },
        consent: {
          rejectedScopes: req.body.remember ? [] : ['offline_access'],
        },
    }).catch(err => {
      res.post(500).send("Error occurs at openid-connect server: " + err);
    });
  });

  // leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
  app.use(oidc.callback);

  // express listen
  app.listen(process.env.PORT || 3000);
});

async function authenticate(emailOrUserName, password, res) {
  const result = await dbHelper.getDb('user').findOne({$or: [{email: emailOrUserName},{username: emailOrUserName}]});
  if(!result.value) {
    //account does not exists
    //TODO: res.send
    return;
  }
  const accountId = result.value;

  const match = await bcrypt.compare(password, account.password);

  // TODO: do after having an object definition
  if(match) {
    return accountId;
  } else {
    //authentication failed
    //TODO: res.send
  }
}