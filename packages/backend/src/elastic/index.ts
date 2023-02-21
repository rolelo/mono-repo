import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: `https://${process.env.ELASTIC_URL}:9200`,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: process.env.ELASTIC_CA,
    rejectUnauthorized: false,
  }
});
