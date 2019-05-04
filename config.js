const project = 'MyApplication';
const domain = 'localhost';
const port = 3000;

let config = {
  project: {project},
  domain: {domain},
  port: {port},
  database: "mongodb://localhost:27017"
};

module.exports = config;

//{project, domain, port, database} = config