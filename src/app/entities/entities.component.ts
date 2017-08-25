import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Entities } from '../../../api/server/collections/entities';
import { Entity } from '../../../api/server/models/entity';

import { Users } from '../../../api/server/collections/users';
import { User } from '../../../api/server/models/user';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { MeteorObservable } from 'meteor-rxjs';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
  paramsSub: Subscription;
  entitiesSub: Subscription;

  usersSub: Subscription;

  entities;
  shots;
  assets;

  formTitle:string = 'ADD TASK';

  // form
  userCtrl: FormControl;
  filteredUsers: Observable<any[]>;
  myContent: any[] = [];

  users;
  userNames;

  //showDetails = false;

  constructor(private route: ActivatedRoute) {
    this.userCtrl = new FormControl();

    this.filteredUsers = this.userCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterUsers(name));
  }

  //this.myApiService.getSearch(value).subscribe((res: any[]) => { this.myContent = res; }); 


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

      Users.find().mergeMap((users)=>{
        return Observable.from(users.map((user)=>{
          return user.profile.name
        })).toArray();
      }).subscribe((users)=>{
        this.users = users;
      })

    });

  }

  formSubmit(taskName) {
    console.log('form submit');
    console.log(taskName);
  }

  filterUsers(val: string) {
    console.log(val);
    return val ? this.users.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
               : this.users;
  }
}
