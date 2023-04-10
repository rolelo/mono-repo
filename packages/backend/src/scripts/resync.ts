import mongoose from 'mongoose';
import * as fs from 'fs';
import { Listing } from '../../../common/models';
const { Client } = require("@elastic/elasticsearch");
import dotenv from "dotenv";

dotenv.config();

const syncElasticWithMongo = async () => {
  await mongoose.connect(
    `mongodb://root:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}:27017`
  );
  const client = new Client({
    node: `https://localhost:9200`,
    auth: {
      username: "elastic",
      password: "Ykbf7mTHszIMLRSC",
    },
    // tls: {
    //   ca: fs.readFileSync('/Users/amir/projects/rolelo/monorepo/certs/ca.crt'),
    //   cert: fs.readFileSync('/Users/amir/projects/rolelo/monorepo/certs/tls.crt')
    // },
  });
  
  const docs = await Listing.find({})
  const docObject = docs.map(d => d.toObject())
  
  console.log(docObject)
}

syncElasticWithMongo()