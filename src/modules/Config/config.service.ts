import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from 'mongoose'

@Injectable()
export class ConfigService{
  constructor(@InjectConnection() private readonly connection: Connection) {}
  
  async TemporalData(){
    const collections = Object.keys(this.connection.collections);
    console.log("collections ",collections);
    
    return collections;
  }

  async resetOne(collectionName: string){
    const collection = this.connection.collections[collectionName];
    if (collection) {
      await collection.deleteMany({});
    }
  }

  async deleteOne(collectionName: string){
    const collection = this.connection.collections[collectionName];
    if (collection) {
      await collection.dropIndexes();
      await collection.drop();
    }
  }
}