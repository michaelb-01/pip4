import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MdAutocompleteTrigger } from '@angular/material';

import { ActivatedRoute } from '@angular/router';

import { Entities } from '../../../api/server/collections/entities';
import { Entity } from '../../../api/server/models/entity';

import { Users } from '../../../api/server/collections/users';
//import { User } from '../../../api/server/models/user';

import { EntityService } from './entity.service';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { MeteorObservable } from 'meteor-rxjs';

export class User {
  constructor(
    public profile: {
      name: string;
    }
  ) { }
}

@Component({
  selector: 'app-entities',
  providers: [ EntityService ],
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
  @ViewChild(MdAutocompleteTrigger) trigger: MdAutocompleteTrigger;
  @ViewChild('userQuery') userQuery;

  paramsSub: Subscription;
  entitiesSub: Subscription;

  usersSub: Subscription;

  entities;
  shots;
  assets;

  formTitle:string = 'ADD TASK';

  entity: any;

  // form
  userCtrl = new FormControl();
  taskCtrl = new FormControl();
  dateCtrl = new FormControl();

  entitiesForm;
  filteredUsers: Observable<any[]>;

  selectedUsers: any[] = [];

  users;
  userFocus = false;

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

  statuses = [
    'Not Started',
    'Active',
    'Pending Feedback',
    'Complete'
  ]

  entityName:string = '';

  currentStatus = this.statuses[0];

  constructor(private route: ActivatedRoute,
              private _entityService: EntityService) { 
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['jobId'])
      .subscribe(jobId => {
        if (this.entitiesSub) {
          this.entitiesSub.unsubscribe();
        }

        this.entitiesSub = MeteorObservable.subscribe('entities', jobId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.entities = Entities.find({"job.jobId":jobId});

            this.assets = this.entities.map(entities => entities.filter(entity => entity.type == 'asset'));
            this.shots = this.entities.map(entities => entities.filter(entity => entity.type == 'shot'));


            if (!this.entities) return;
          });
        });
      });

    this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {
      Users.find().subscribe((users)=>{
        this.users = users;

        // remove this from the subscribe function if you don't want pre-filled list 
        // to show up when sidenav opens
        this.filteredUsers = this.userCtrl.valueChanges
            .startWith(null)
            .map(user => user && typeof user === 'object' ? user.profile.name : user)
            .map(name => this.filterUsers(name));
      })
    });

    // Observable.from(this.options)
    //           .toArray()
    //           .subscribe(users=>{
    //   this.users = users;
    // });
  }

  formSubmit(form) {
    let task = {
      "type": this.taskCtrl.value,
      "users": this.selectedUsers,
      "dueDate": this.dateCtrl.value,
      "status": this.currentStatus
    }

    MeteorObservable.call('addTask', this.entity._id, task).subscribe({
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

  displayFn(user: User): string {
    return user ? user.profile.name : '';
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
    this.userQuery.nativeElement.focus();
  }

  openSidenav(entity) {
    this.entity = entity;

    // filter tasks based on pre-existing tasks on entity
    this.filteredTasks = this.tasks.filter(task=>{
      return entity.tasks.filter(entityTask=>{
        return entityTask.type.toLowerCase() == task.toLowerCase();
      }).length == 0;
    })

    this.entityName = entity.name;
  }
}
