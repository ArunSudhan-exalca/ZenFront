import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardingFieldMasterComponent } from './on-boarding-field-master.component';

describe('OnBoardingFieldMasterComponent', () => {
  let component: OnBoardingFieldMasterComponent;
  let fixture: ComponentFixture<OnBoardingFieldMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnBoardingFieldMasterComponent]
    });
    fixture = TestBed.createComponent(OnBoardingFieldMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
