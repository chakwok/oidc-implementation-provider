const config = require('./config');

const express = require('express');
const rp = require('request-promise');
const mongo = require('mongodb');

const {project, domain, port, dbPath, adapter, clients} = config;

// const assert = require('assert');
const Provider = require('oidc-provider');

const oidc = new Provider(`https://${domain}/`);

oidc.initialize({
  adapter: adapter,
  clients: clients,
}).then(() => {
  oidc.proxy = true;

  oidc.listen(port);
});