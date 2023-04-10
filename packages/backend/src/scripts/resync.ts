import mongoose from 'mongoose';
import * as fs from 'fs';
import { Listing, ListingDocument, ListingSchema } from '../../../common/models';
import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  node: `${process.env.ELASTIC_PROTOCOL}://${process.env.ELASTIC_URL}:9200`,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  },
  // tls: {
  //   ca: fs.readFileSync('/Users/amir/projects/rolelo/monorepo/certs/ca.crt'),
  //   cert: fs.readFileSync('/Users/amir/projects/rolelo/monorepo/certs/tls.crt')
  // },
});
const syncElasticWithMongo = async () => {
  await mongoose.connect(
    `mongodb://root:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}:27017`
  );
  
  const docs = await Listing.find({})
  const docObjects= docs.map(d => d.toObject())
  
  await deleteItemsInIndex()

  const createIndexPromises = []
  docObjects.forEach((doc) => {
    createIndexPromises.push(createIndexAndPopulate(doc))
  })
  await Promise.all(createIndexPromises);
  console.log('done')
  return
}

const deleteItemsInIndex = async () => {
  try {
    await client.deleteByQuery({
      index: 'listings',
      body: {
        query: {
          match_all: {},
        },
      },
    });
  } catch (e) {
    console.log(e)
  }
}

const createIndexAndPopulate = async (listing: ListingSchema) => {
  try {
    const { _id, ...listingWithoutId } = listing;
    await client.index<ListingDocument>({
      index: "listings",
      document: {
        ...listingWithoutId,
        listingId: _id,
      },
    });
    
  } catch (e) {
   console.log(e) 
  }
}

syncElasticWithMongo()