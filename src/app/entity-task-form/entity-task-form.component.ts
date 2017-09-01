import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Mongo } from 'meteor/mongo';

import { Users } from '../../../api/server/collections/users';

@Component({
  selector: 'app-entity-task-form',
  templateUrl: './entity-task-form.component.html',
  styleUrls: ['./entity-task-form.component.scss']
})
export class EntityTaskFormComponent implements OnInit {
  usersSub: Subscription;

  formTitle:string = 'ADD TASK';

  userCtrl = new FormControl();
  taskCtrl = new FormControl();
  dateCtrl = new FormControl();

  date;

  entity;
  task;

  entitiesForm;
  filteredUsers: Observable<any[]>;

  selectedUsers: any[] = [];

  users;
  userFocus = false;

  editing = false;

  tasks = [
    'Model',
    'Texture',
    'Rig',
    'Anim',
    'FX',
    'Look Dev',
    'Light',
    'Roto',
    'Pre Comp',
    'Comp'
  ];

  filteredTasks = [];
  selectedTask = this.tasks[0];

  statuses = [
    {value: 'notStarted', viewValue: 'Not Started'},
    {value: 'active', viewValue: 'Active'},
    {value: 'pendingFeedback', viewValue: 'Pending Feedback'},
    {value: 'complete', viewValue: 'Complete'},
  ]

  entityName:string = '';

  currentStatus;

  constructor() { 
  }

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {
      Users.find().subscribe((users)=>{
        this.users = users;
      })
    });

    // remove this from the subscribe function if you don't want pre-filled list 
    // to show up when sidenav opens
    this.filteredUsers = this.userCtrl.valueChanges
        .startWith(null)
        .map(user => user && typeof user === 'object' ? user.profile.name : user)
        .map(name => this.filterUsers(name));
  }

  formSubmit(form) {
    let task = {
      "_id": this.task._id ? this.task._id : new Mongo.ObjectID(), 
      "type": this.selectedTask,
      "users": this.selectedUsers,
      "dueDate": this.dateCtrl.value,
      "status": this.currentStatus
    }

    let method = this.editing ? 'updateTask' : 'createTask'; 

    MeteorObservable.call(method, this.entity._id, task).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }

  filterUsers(name:string) {
    if (this.users == null) return [];
    if (name == null) {
      name = '';
    }

    let filteredUsers = [];
    for(var i = 0; i < this.users.length; i++) {
      if (name != '' && this.users[i].profile.name.toLowerCase().indexOf(name.toLowerCase()) !== 0) {
        continue;
      }
      let ok = 1;
      for(let j = 0; j < this.selectedUsers.length; j++) {
        if (this.selectedUsers[j].profile.name == this.users[i].profile.name) {
          ok = 0;
          break;
        }
      }
      if (ok == 1) {
        filteredUsers.push(this.users[i]);
      }
    }
    
    return filteredUsers;
  }
  
  removeUser(user) {
    for (var i = 0; i < this.selectedUsers.length; i++) {
      if (user.profile.name == this.selectedUsers[i].profile.name) {
        this.selectedUsers.splice(i,1);
        return;
      }
    }
  }

  selectUser(user) {
    if (this.selectedUsers.indexOf(user) == -1) {
      this.selectedUsers.push(user);
    }

    this.userCtrl.setValue('');
  }

  addTask(entity) {
    this.formTitle = 'ADD TASK';
    this.entity = entity;

    // filter tasks based on pre-existing tasks on entity
    this.filteredTasks = this.tasks.filter(task=>{
      return entity.tasks.filter(entityTask=>{
        return entityTask.type.toLowerCase() == task.toLowerCase();
      }).length == 0;
    })

    this.selectedUsers = [];
    this.editing = false;
    this.dateCtrl.setValue(null);
    this.currentStatus = 'active';

    this.entityName = entity.name;
  }

  editTask(entity, task) {
    this.entity = entity;
    this.task = task;
    this.formTitle = 'EDIT TASK';
    this.entityName = entity.name;

    this.selectedTask = task.type;
    this.filteredTasks = [task.type];
    this.editing = true;
    this.selectedUsers = [];

    task.users.forEach(user=>{
      this.selectedUsers.push({
        'profile':{
          'name':user
        }
      })
    })

    this.currentStatus = task.status;
    this.dateCtrl.setValue(task.dueDate);
    //this.taskCtrl.setValue(entity.type);
  }
}

