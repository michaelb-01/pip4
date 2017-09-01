import { Injectable } from '@angular/core';

import { Mongo } from 'meteor/mongo';

import { Entities } from '../../../api/server/collections/entities';
import { Entity } from '../../../api/server/models/entity';

@Injectable()
export class EntityService {

  constructor() { }
  
  public addTask(entityId, task) {
    let id = new Mongo.ObjectID(entityId._str);

    console.log(id);

      // "_id": new Mongo.ObjectID(),
      // "type": taskTypes[i],
      // "users": taskUsers,
      // "dueDate": new Date(),
      // 'status': statusTypes[Math.floor((Math.random() * statusTypes.length))]

    Entities.update({"_id":entityId },{$set:{'status':'completed'}});

    //Entities.update({"_id":entityId },{$push : {"tasks":task}});
  }
}