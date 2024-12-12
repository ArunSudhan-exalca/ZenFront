import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { VendorTokenCheck } from '../../models/vendor-registration';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import {convertElementSourceSpanToLoc} from "@angular-eslint/template-parser/dist/template-parser/src/convert-source-span-to-loc";
import {log} from "util";
import {ResetPassword} from "../../models/ResetPassword";
import {config} from "rxjs";
@Component({
  selector: 'ngx-vendor-reset-password-page',
  templateUrl: './vendor-reset-password-page.component.html',
  styleUrls: ['./vendor-reset-password-page.component.scss']
})
export class VendorResetPasswordPageComponent {

  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  loginForm: FormGroup;
  email: string;
  passcode:string;
  hide = true;
  VendorTokenCheck: VendorTokenCheck;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  configs = {
    allowNumbersOnly: false,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    // // private _menuUpdationService: MenuUpdataionService,
    // private _loginService: LoginService,
    //public dialog: MatDialog,
    public snackBar: MatSnackBar,private route: ActivatedRoute

    // private _cookieService: CookieService
  ) {

    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      NewPassword: ['', Validators.required],
      ConformPassword :['',Validators.required],
      Passcode :['',Validators.required]
    });

    this.VendorTokenCheck = new VendorTokenCheck();
    this.route.queryParams.subscribe(params => {
      this.VendorTokenCheck.Token = params['token'];
      this.VendorTokenCheck.TransID = params['Id'];
      this.VendorTokenCheck.EmailAddress = params['Email'];
      this.email = params['Email'];
    });
  }
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
  // LoginClicked(): void {
  //   if (this.loginForm.valid) {
  //     this.IsProgressBarVisibile = true;
  //     this._authService.VendorLogin(this.loginForm.get('UserId').value, this.loginForm.get('password').value).subscribe(
  //       (data) => {
  //         if(data){
  //           this.IsProgressBarVisibile = false;
  //           this._router.navigate(['/pages/register'], {
  //             queryParams: {
  //               token: this.VendorTokenCheck.Token,
  //               Id: this.VendorTokenCheck.TransID,
  //               Email: this.VendorTokenCheck.EmailAddress
  //             }
  //           });
  //         }
  //         else{
  //           this.IsProgressBarVisibile = false;
  //           this.notificationSnackBarComponent.openSnackBar(`Username and Password may be incorrect`, SnackBarStatus.success);
  //
  //         }
  //       }
  //     );
  //   } else {
  //     Object.keys(this.loginForm.controls).forEach(key => {
  //       const abstractControl = this.loginForm.get(key);
  //       abstractControl.markAsDirty();
  //     });
  //   }
  //
  // }

  onOtpChange(otp) {
    this.passcode = otp;
  }

  resetClicked(){
    if(this.loginForm.get('NewPassword').value == this.loginForm.get('ConformPassword').value){
      if(this.passcode && this.passcode.length == 5){
        let reset = new ResetPassword();
        reset.Password = this.loginForm.get('ConformPassword').value;
        reset.PassCode = this.passcode;
        reset.Email = this.email;

        this._authService.resetPassword(reset).subscribe({
          next:(res)=>{
            if(res.message == 'Password Reset was successful.'){
              this._router.navigate(['/pages/login']);
            }else{
              this.openSnackBar('Invalid passcode', SnackBarStatus.danger)
            }
            this.loginForm.reset();
          },
          error:(err)=>{
            this.openSnackBar(err.error, SnackBarStatus.danger)
          }
        });


      }else{
        this.openSnackBar('passcode is invalid', SnackBarStatus.danger);
      }
    }else{

      this.openSnackBar('New password and Conform password are not matched', SnackBarStatus.danger);
    }




  }

  validateForm():boolean{
    return this.loginForm.valid &&
      this.passcode?.length === 5 &&
      this.loginForm.value.NewPassword == this.loginForm.value.ConformPassword;
  }

  openSnackBar(Message: string, status: SnackBarStatus, duration = 2000): void {
    this.snackBar.open(Message, '', {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: status === SnackBarStatus.success ? 'success' : status === SnackBarStatus.danger ? 'danger' :
        status === SnackBarStatus.warning ? 'warning' : 'info'
    });
  }

}
