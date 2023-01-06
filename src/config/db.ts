import { MongoClient } from "mongodb";
import { config } from "dotenv";
config({ path: ".env" });

const mongo = process.env.MONGO_URI || "";


const client = new MongoClient(mongo);
  

let _db: any;

export function connectToServer(callback: (err: any) => void) {
  client.connect((err, db) => {
    if (db) {
      _db = db.db("shop");
      console.log(`Successfully connected to ${mongo}.`);
    }
    callback(err);
  });
}

export function getDb() {
  return _db;
}