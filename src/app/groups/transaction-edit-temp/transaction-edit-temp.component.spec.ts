import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditTempComponent } from './transaction-edit-temp.component';

describe('TransactionEditTempComponent', () => {
  let component: TransactionEditTempComponent;
  let fixture: ComponentFixture<TransactionEditTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionEditTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionEditTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
