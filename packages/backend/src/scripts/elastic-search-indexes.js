const fs = require('fs');
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: `http://localhost:9200`,
  auth: {
    username: "elastic",
    password: "elastic123",
  },
  // tls: {
  //   ca: fs.readFileSync('/Users/amir/projects/rolelo/monorepo/certs/ca.crt'),
  //   cert: fs.readFileSync('/Users/amir/projects/rolelo/monorepo/certs/tls.crt')
  // },
});


const createIndex = async (indexName) => {
  await client.indices.create({ index: indexName });
  console.log("Index created");
};

createIndex("listings").catch(e => {
  console.log(e)
});