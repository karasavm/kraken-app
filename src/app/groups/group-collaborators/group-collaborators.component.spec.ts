import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCollaboratorsComponent } from './group-collaborators.component';

describe('GroupCollaboratorsComponent', () => {
  let component: GroupCollaboratorsComponent;
  let fixture: ComponentFixture<GroupCollaboratorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCollaboratorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
