import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTaskFormComponent } from './entity-task-form.component';

describe('EntityTaskFormComponent', () => {
  let component: EntityTaskFormComponent;
  let fixture: ComponentFixture<EntityTaskFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTaskFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
