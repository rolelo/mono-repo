import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: `http://${process.env.ELASTIC_URL}:9200`,
  tls: {
    ca: process.env.ELASTIC_CA
  }
});
