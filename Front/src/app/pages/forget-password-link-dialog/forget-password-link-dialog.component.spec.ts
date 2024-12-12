import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordLinkDialogComponent } from './forget-password-link-dialog.component';

describe('ForgetPasswordLinkDialogComponent', () => {
  let component: ForgetPasswordLinkDialogComponent;
  let fixture: ComponentFixture<ForgetPasswordLinkDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetPasswordLinkDialogComponent]
    });
    fixture = TestBed.createComponent(ForgetPasswordLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
