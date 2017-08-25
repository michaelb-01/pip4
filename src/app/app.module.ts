import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { RouterModule, Routes } from '@angular/router';

import { MdInputModule, MdAutocompleteModule, MdDialogModule, MdButtonModule, MdToolbarModule, MdGridListModule, MdSidenavModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';

import 'hammerjs';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './job/job.component';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';
import { EntitiesComponent } from './entities/entities.component';

import { FirstLetterPipe } from './pipes/first-letter.pipe';

const appRoutes: Routes = [
  { path: 'job/:jobId', component: JobComponent },
  { path: '',
    redirectTo: '/jobs',
    pathMatch: 'full'
  },
  { path: '**', component: JobsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DatepickerComponent,
    SidenavComponent,
    JobsComponent,
    JobComponent,
    ThumbnailComponent,
    EntitiesComponent,
    FirstLetterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MdAutocompleteModule,
    MdInputModule,
    MdButtonModule,
    MdDatepickerModule,
    MdDialogModule,
    MdNativeDateModule,
    MdSidenavModule,
    MdGridListModule,
    MdToolbarModule,
    RouterModule.forRoot(
      appRoutes
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})

export class AppModule {
}