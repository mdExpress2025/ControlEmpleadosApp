import { MongoClient } from "mongodb";

const uri="mongodb+srv://gonzalezmartinnatanael:1Tbbr7KZOnP77SM7@cluster0.r5te7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  
  export default clientPromise;