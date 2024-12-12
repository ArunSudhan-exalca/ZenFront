import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorResetPasswordPageComponent } from './vendor-reset-password-page.component';

describe('VendorResetPasswordPageComponent', () => {
  let component: VendorResetPasswordPageComponent;
  let fixture: ComponentFixture<VendorResetPasswordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorResetPasswordPageComponent]
    });
    fixture = TestBed.createComponent(VendorResetPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
