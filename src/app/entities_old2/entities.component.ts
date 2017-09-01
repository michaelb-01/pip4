import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
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
  @ViewChild('userSeach') userSeach:any; 
  @ViewChild('userSeachResults') userSeachResults:any; 

  paramsSub: Subscription;
  entitiesSub: Subscription;

  usersSub: Subscription;

  entities;
  shots;
  assets;

  formTitle:string = 'ADD TASK';

  // form
  entitiesForm;
  userQuery:string = '';
  filteredUsers: Observable<any[]>;

  selectedUsers: any[] = [];

  users;
  userFocus = false;


  //showDetails = false;

  constructor(private route: ActivatedRoute) { 
    Observable.fromEvent(document, 'click')
      .map(x=>this.filterClicks(x))
      .subscribe();
  }

  filterClicks(click) {
    console.log(click);
    if (click.target == this.userSeach.nativeElement || click.target.className == 'user-result') {
      this.filterUsers();
      this.userFocus = true;
      console.log('focus');
    }
    else {
      this.userFocus = false;
      console.log('focus out');
    }
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
      Users.find().mergeMap((users)=>{
        return Observable.from(users.map((user)=>{
          return user.profile.name
        })).toArray();
      }).subscribe((users)=>{
        this.users = users;
      })
    });

  }

  ngOnChanges(changes: SimpleChanges) {
      console.log(changes);
  }

  onKeyDown(e) {
    console.log('key down');
    console.log(e);
  }

  formSubmit(taskName) {
    console.log('form submit');
    console.log(taskName);
  }

  filterUsers() {
    console.log(this.userQuery);


    // if query is empty return users minus selected users
    // else return if name begins with query 
    this.filteredUsers = this.users.filter(s => s.toLowerCase().indexOf(this.userQuery.toLowerCase()) == 0 
                                            && this.selectedUsers.includes(s) == false);
  }

  selectUser(user) {
    console.log('select user');
    if (this.selectedUsers.indexOf(user) == -1) {
      this.selectedUsers.push(user);
    }
    this.userQuery = '';
    this.filterUsers();
    this.userSeach.nativeElement.focus();
  }

  initialiseQuery() {
    //this.userQuery = 'hello';// this.searchQuery.nativeElement.value;


    // if (this.userQuery === null || this.selectedUsers.indexOf(this.userQuery) > -1 || this.userQuery == '') {
    //   console.log('reset query');
    //   this.userQuery = '';
    // }
    // console.log('intitialise: ');
    // console.log(this.userQuery);
    // console.log(this.searchQuery);


    //this.userCtrl.setValue('hello');
  }

  removeUser(name) {
    let index = this.selectedUsers.indexOf(name);

    if (index > -1) {
      this.selectedUsers.splice(index,1);
    }

    this.filterUsers();
  }
}
