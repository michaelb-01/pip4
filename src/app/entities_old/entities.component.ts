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
  @ViewChild('searchQuery') searchQuery:any; 

  paramsSub: Subscription;
  entitiesSub: Subscription;

  usersSub: Subscription;

  entities;
  shots;
  assets;

  formTitle:string = 'ADD TASK';

  // form
  entitiesForm;
  userQuery:string = 'mike';
  userCtrl: FormControl = new FormControl('mike');
  filteredUsers: Observable<any[]>;

  selectedUsers: any[] = [];

  users;


  //showDetails = false;

  constructor(private route: ActivatedRoute) {
    this.filteredUsers = this.userCtrl.valueChanges
        .startWith('')
        .map(name => this.filterUsers(name));

    this.userCtrl.valueChanges.subscribe(x=>{
      console.log('value change: ');
      console.log("'" + x + "'");
    })
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

  filterUsers(val: string) {
    console.log('filter users');
    console.log(this.users);
    console.log(val);
    if (this.users === undefined) return;
    // if query is empty return users minus selected users
    // else return if name begins with query 
    return val ? this.users.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) == 0 && this.selectedUsers.includes(s) == false)
               : this.users.filter(s => this.selectedUsers.includes(s) == false);
  }

  selectUser(user) {
    setTimeout(()=>{
      if (this.selectedUsers.indexOf(user) == -1) {
        this.selectedUsers.push(user);
      }
      this.userCtrl.reset();
      //this.userQuery = '';

      //this.entitiesForm.reset();
    },100)
  }

  initialiseQuery() {
    //this.userQuery = 'hello';// this.searchQuery.nativeElement.value;
    setTimeout(()=>{
      this.userCtrl.setValue(this.searchQuery.nativeElement.value);
    },150);
    return;

    // if (this.userQuery === null || this.selectedUsers.indexOf(this.userQuery) > -1 || this.userQuery == '') {
    //   console.log('reset query');
    //   this.userQuery = '';
    // }
    // console.log('intitialise: ');
    // console.log(this.userQuery);
    // console.log(this.searchQuery);


    //this.userCtrl.setValue('hello');
  }

  toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  removeUser(name) {
    console.log(name);
    let index = this.selectedUsers.indexOf(name);

    if (index > -1) {
      this.selectedUsers.splice(index,1);
    }
  }
}
