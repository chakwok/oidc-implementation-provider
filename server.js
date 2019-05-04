const config = require('./config');

const express = require('express');
const rp = require('request-promise');
const mongo = require('mongodb');

const {project, domain, port, database} = config;

// const assert = require('assert');
const Provider = require('oidc-provider');


const oidc = new Provider(`https://${domain}`);

oidc.initialize({
  clients: [{ client_id: 'foo', client_secret: 'bar', redirect_uris: ['http://lvh.me/cb'] }],
}).then(() => {
  oidc.proxy = true;

  oidc.listen(port);
});