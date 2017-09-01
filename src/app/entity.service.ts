import { Injectable } from '@angular/core';

@Injectable()
export class EntityService {

  constructor() { }

  public addTask(entityId, task) {
    console.log(entityId);
    console.log(task);

      // "_id": new Mongo.ObjectID(),
      // "type": taskTypes[i],
      // "users": taskUsers,
      // "dueDate": new Date(),
      // 'status': statusTypes[Math.floor((Math.random() * statusTypes.length))]

    //Entities.update({"_id":entityId },{$push : {"tasks":task}});
  }

}
