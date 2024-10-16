import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';

export class MongoFakeServer {
  constructor() {}
  connection: Connection;
  mongo: MongoMemoryServer;

  async connectInMemoryMongo() {
    this.mongo = await MongoMemoryServer.create();
    const uri = this.mongo.getUri();

    this.connection = (await connect(uri)).connection;
    return uri;
  }

  async closeInMemoryMongo() {
    if (this.connection) {
      await this.connection.dropDatabase();
      await this.connection.close();
    }

    if (this.mongo) {
      await this.mongo.stop();
    }
  }
}

const mongoFakeServer = new MongoFakeServer();
export default mongoFakeServer;
