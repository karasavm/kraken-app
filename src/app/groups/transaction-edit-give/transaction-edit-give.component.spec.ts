import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditGiveComponent } from './transaction-edit-give.component';

describe('TransactionEditGiveComponent', () => {
  let component: TransactionEditGiveComponent;
  let fixture: ComponentFixture<TransactionEditGiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionEditGiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionEditGiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
