import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { VendorTokenCheck } from '../../models/vendor-registration';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'ngx-vendorlogin',
  templateUrl: './vendorlogin.component.html',
  styleUrls: ['./vendorlogin.component.scss']
})
export class VendorloginComponent implements OnInit {
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  loginForm: FormGroup;
  hide = true;
  VendorTokenCheck: VendorTokenCheck;
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
      UserId: ['', Validators.required],
       password: ['', Validators.required]
     });
     this.VendorTokenCheck = new VendorTokenCheck();
    this.route.queryParams.subscribe(params => {
      this.VendorTokenCheck.Token = params['token'];
      this.VendorTokenCheck.TransID = params['Id'];
      this.VendorTokenCheck.EmailAddress = params['Email'];
    });

   }
   togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
   LoginClicked(): void {
    if (this.loginForm.valid) {
      this.IsProgressBarVisibile = true;
      this._authService.VendorLogin(this.loginForm.get('UserId').value, this.loginForm.get('password').value).subscribe(
        (data) => {
          if(data){
            this.IsProgressBarVisibile = false;
            this._router.navigate(['/pages/register'], {
              queryParams: {
                token: this.VendorTokenCheck.Token,
                Id: this.VendorTokenCheck.TransID,
                Email: this.VendorTokenCheck.EmailAddress
              }
            });
          }
      else{
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(`Username and Password may be incorrect`, SnackBarStatus.success);

      }
         }
      );
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const abstractControl = this.loginForm.get(key);
        abstractControl.markAsDirty();
      });
    }

  }
}
