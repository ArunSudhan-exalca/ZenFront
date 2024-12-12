import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../service/auth.service';
// import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
// import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { ResetPasswordModel } from '../../models/master';
@Component({
  selector: 'ngx-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
  //@Input() Maild;
  OldPasswordHide: boolean = false;
  NewPasswordHide: boolean = false;
  checknewpassword: boolean = true;
  checkoldpassword: boolean = true;
  
  constructor(public matDialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar, private _authService: AuthService) {
      
     }
  ResetForm = new FormGroup({
    OldPassword: new FormControl(''),
    NewPassword: new FormControl('', [Validators.required]),
    ConfirmPassword: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
  }
  hider(event) {
    if (event != null) {
      this.OldPasswordHide = event === 1 ? true : false;
      this.NewPasswordHide = event === 3 ? true : false;
    }
  }
  close() {
    this.matDialogRef.close();
  }
  reset() {
    this.ResetForm.reset();
  }
  enterpress(event) {
    // this.confirm();
  }
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
  confirm(): void {
    if (this.ResetForm.valid) {
       var changepassword = new ResetPasswordModel();
      changepassword.NewPassword = this.ResetForm.value.NewPassword;
      changepassword.OldPassword = "";
      changepassword.MailID = this.data;
      this.matDialogRef.close(changepassword);
      // var changepassword = new ResetPasswordModel();
      // changepassword.NewPassword = this.ResetForm.value.NewPassword;
      // changepassword.OldPassword = this.ResetForm.value.OldPassword;
      // changepassword.MailID = this.Maild;
      // this._authService.changePassword(changepassword).subscribe(
      //   (data) => {
      //     this.notificationSnackBarComponent.openSnackBar(`Password changed successfully`, SnackBarStatus.success);

      //   }
      // )
    }
  }
}
