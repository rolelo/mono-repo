const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "http://localhost:9200",
});


const createIndex = async (indexName) => {
  await client.indices.create({ index: indexName });
  console.log("Index created");
};

createIndex("listings");