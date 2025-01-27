import { Injectable } from '@nestjs/common';
import { Person } from './person.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person.name) private PersonModel : Model<Person>) {}

  async list(){
    return await this.PersonModel.find();
  }

  async listAsync ( data : any = {} ){
    return await this.PersonModel.find( data );
  }

  async findOne ( data : any = {} ){
    return await this.PersonModel.findOne( data );
  }
  
  async createPerson(data : object){
    const response = await this.PersonModel.create(data);
    return response.save();
  }

  async updatePerson(id: string, Person : object){
    return await this.PersonModel.findByIdAndUpdate(id, Person);
  }

  async deletePerson(id: string){
    return await this.PersonModel.findByIdAndDelete(id);
  }

}
