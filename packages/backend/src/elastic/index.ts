import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: `${process.env.ELASTIC_PROTOCOL}://${process.env.ELASTIC_URL}:9200`,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  ...(process.env.ELASTIC_CA ? {
    ca: process.env.ELASTIC_CA,
    rejectUnauthorized: false,
  } : {})
});