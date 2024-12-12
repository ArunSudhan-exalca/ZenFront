import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FuseConfigService } from '@fuse/services/config.service';
// import { fuseAnimations } from '@fuse/animations';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationDetails, ChangePassword, EMailModel } from '../../models/master';
import { AuthService } from '../../service/auth.service';
// import { AuthService } from 'app/services/auth.service';
// import { LoginService } from 'app/services/login.service';
// import { UserDetails } from 'app/models/user-details';
// import { M}
// import {MatDialog}
// import { MatCard,MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
// import { NotificationSnackBarComponent } from '../../notifications/notification-snack-bar/notification-snack-bar.component';
// import { SnackBarStatus } from '../../notifications/snackbar-status-enum';
// import {Component} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogConfig,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ForgetPasswordLinkDialogComponent } from '../forget-password-link-dialog/forget-password-link-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
// import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

// import { MenuUpdataionService } from 'app/services/menu-update.service';
// import { AuthenticationDetails, ChangePassword, EMailModel } from 'app/models/master';
// import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
// import { NbCardComponent } from '@nebular/theme';}

@Component({
  selector: 'ngx-authendication',
  templateUrl: './authendication.component.html',
  styleUrls: ['./authendication.component.scss']
})
export class AuthendicationComponent implements OnInit {
  loginForm: FormGroup;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[] = [];
  message = 'Snack Bar opened.';
  actionButtonLabel = 'Retry';
  action = true;
  setAutoHide = true;
  autoHide = 2000;
  refresh: number = 1;
  addExtraClass: false;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  Username = '';
  dialogRef: any;
  dialogService: any;
  hide = true;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    // // private _menuUpdationService: MenuUpdataionService,
    // private _loginService: LoginService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,

    // private _cookieService: CookieService
  ) {


    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
   // localStorage.clear();


    this.loginForm = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    // if (undefined !== this._cookieService.get('OBDUsername')) {
    //   this.Username = this._cookieService.get('OBDUsername');
    // }
  }

  LoginClicked(): void {
    // this._router.navigate(['pages/dashboard']);
    if (this.loginForm.valid) {
      this.IsProgressBarVisibile = true;
      this._authService.login(this.loginForm.get('userName').value, this.loginForm.get('password').value).subscribe(
        (data) => {
          this.IsProgressBarVisibile = false;
          // console.log('LoginClicked', data);
          const dat = data as AuthenticationDetails;

          // if (data.IsChangePasswordRequired === 'Yes') {
            // this.notificationSnackBarComponent.openSnackBar(data.ReasonForReset, SnackBarStatus.danger);
            // this.OpenChangePasswordDialog(dat);
          // }
          // else if(data.IsSuccess)
          // {
          //   this.notificationSnackBarComponent.openSnackBar(data.Message,SnackBarStatus.danger);
          // }
          // else {
            this.saveUserDetails(dat);
          // }

          // this._cookieService.put('OBDUsername', this.Username);
        },
        (err) => {
          this.IsProgressBarVisibile = false;

           this.notificationSnackBarComponent.openSnackBar(err, SnackBarStatus.danger);
        }
      );

    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const abstractControl = this.loginForm.get(key);
        abstractControl.markAsDirty();
      });
    }

  }


  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
  saveUserDetails(data: AuthenticationDetails): void {
    localStorage.setItem('authorizationData', JSON.stringify(data));
    localStorage.setItem("Reloaddata",JSON.stringify(true));
    // this.UpdateMenu();
    // this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
    if (data.userRole === 'Administrator') {
      this._router.navigate(['/pages/identity']);
    }
    else if (data.userRole === "Initiator") {
      this._router.navigate(['/pages/dashboard']);
    }
    // } else if (data.userRole === 'Vendor') {
    //   this._router.navigate(['pages/companydetails']);
    // }

    // this._router.navigate(['pages/dashboard']);
  }

  // OpenChangePasswordDialog(data: AuthenticationDetails): void {
  //   const dialogConfig: MatDialogConfig = {
  //     data: data,
  //     panelClass: 'change-password-dialog'
  //   };
  //   const dialogRef = this.dialog.open(ChangePasswordDialogComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(
  //     result => {
  //       if (result) {
  //         const changePassword = result as ChangePassword;
  //         changePassword.UserID = data.UserID;
  //         changePassword.UserName = data.UserName;
  //         this._authService.ChangePassword(changePassword).subscribe(
  //           (res) => {
  //             console.log('ChangePassword Response', res);
  //             if (res != null) {
  //               this.notificationSnackBarComponent.openSnackBar('Password updated successfully, please log with new password', SnackBarStatus.success);
  //             } else {
  //               this.notificationSnackBarComponent.openSnackBar('Password Should Not Be Same As Previous 5 Passwords', SnackBarStatus.danger);
  //             }
  //             this._router.navigate(['/auth/login']);
  //           }, (err) => {
  //             this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //             this._router.navigate(['/auth/login']);
  //             console.error(err);
  //           }
  //         );
  //       }
  //     });
  // }

  OpenForgetPasswordLinkDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'forget-password-link-dialog'
    };
    const dialogRef = this.dialog.open(ForgetPasswordLinkDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          console.log("result",result)
          //const emailModel = result as EMailModel;
          let emailModel = new EMailModel();
          emailModel.UserName = result.UserName;
          emailModel.siteURL = result.siteURL;
          console.log("emailModel",emailModel)
          this.IsProgressBarVisibile = true;
          this._authService.SendResetLinkToMail(emailModel).subscribe(
            (data) => {
              if(data.userName =="Admin"){
                this.notificationSnackBarComponent.openSnackBar(`Admin password will not able to change`, SnackBarStatus.success);
              }
              else{
                const res = data as string;
                if (res != null) {
                  //this.dialogRef.close();
                  const dialogConfig1: MatDialogConfig = {
                    data: data.email,
                    panelClass: 'forget-password-dialog'
                  };
                  // const dialogRef1 = this.dialog.open(ForgotPasswordDialogComponent, dialogConfig1);
                  // dialogRef1.afterClosed().subscribe(
                  //   result => {
                  //     if (result) {
                  //       var changepassword = new ChangePassword();
                  //       changepassword.UserName = emailModel.UserName;
                  //       changepassword.CurrentPassword = result.OldPassword;
                  //       changepassword.NewPassword = result.NewPassword;
                  //       this._authService.changePassword(changepassword).subscribe(
                  //         (data) => {
                  //           this.notificationSnackBarComponent.openSnackBar(`Password changed successfully`, SnackBarStatus.success);
                  //         }
                  //       )
                  //     }
                  //     else{
                  //       this.notificationSnackBarComponent.openSnackBar(`Something Went wrong`, SnackBarStatus.success);
                  //
                  //     }
                  //   }
                  // );
                }
              }

              // this.notificationSnackBarComponent.openSnackBar(res, SnackBarStatus.success);
              //this.notificationSnackBarComponent.openSnackBar(`Reset password link sent successfully to registered mail address`, SnackBarStatus.success);
              // this.ResetControl();

              // this._router.navigate(['auth/login']);
            },
            (err) => {
              console.error(err);
              this.IsProgressBarVisibile = false;
              // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
          );
        }
      });
  }

  UpdateMenu(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      // console.log(this.MenuItems);
    } else {
    }
    // if (this.MenuItems.indexOf('Admin Dashboard') >= 0) {
    //   this.children.push(
    //     {
    //       id: 'dashboard',
    //       title: 'Dashboard',
    //       translate: 'NAV.SAMPLE.TITLE',
    //       type: 'item',
    //       icon: 'dashboardIcon',
    //       isSvgIcon: true,
    //       // icon: 'dashboard',
    //       url: '/pages/dashboard',
    //     }
    //   );
    // }
    // if (this.MenuItems.indexOf('Company Details') >= 0) {
    //   this.children.push(
    //     {
    //       id: 'companydetails',
    //       title: 'My Details',
    //       translate: 'NAV.SAMPLE.TITLE',
    //       type: 'item',
    //       icon: 'mydetailsIcon',
    //       isSvgIcon: true,
    //       // icon: 'dashboard',
    //       url: '/pages/companydetails',
    //     }
    //   );
    // }

    // if (this.MenuItems.indexOf('Identity') >= 0) {
    //   this.subChildren.push(
    //     {
    //       id: 'identity',
    //       title: 'Identity',
    //       type: 'item',
    //       url: '/master/identity'
    //     },
    //   );
    // }

    // if (this.MenuItems.indexOf('Bank') >= 0) {
    //   this.subChildren.push(
    //     {
    //       id: 'bank',
    //       title: 'Bank',
    //       type: 'item',
    //       url: '/master/bank'
    //     },
    //   );
    // }
    // if (this.MenuItems.indexOf('OBD Field Master') >= 0) {
    //   this.subChildren.push(
    //     {
    //       id: 'obdfield',
    //       title: 'OBD Field',
    //       type: 'item',
    //       url: '/master/obdfield'
    //     },
    //   );
    // }

    // if (true || this.MenuItems.indexOf('App') >= 0) {
    //   this.subChildren.push(
    //     {
    //       id: 'menuapp',
    //       title: 'App',
    //       type: 'item',
    //       url: '/master/menuApp'
    //     },
    //   );
    // }
    // if (true || this.MenuItems.indexOf('Role') >= 0) {
    //   this.subChildren.push(
    //     {
    //       id: 'role',
    //       title: 'Role',
    //       type: 'item',
    //       url: '/master/role'
    //     },
    //   );
    // }
    // if (true || this.MenuItems.indexOf('User') >= 0) {
    //   this.subChildren.push(
    //     {
    //       id: 'user',
    //       title: 'User',
    //       type: 'item',
    //       url: '/master/user'
    //     }
    //   );
    // }

    //   if (this.MenuItems.indexOf('App') >= 0 || this.MenuItems.indexOf('Role') >= 0 ||
    //     this.MenuItems.indexOf('User') >= 0 || this.MenuItems.indexOf('Identity') >= 0
    //     || this.MenuItems.indexOf('Bank') >= 0) {
    //     this.children.push({
    //       id: 'master',
    //       title: 'Master',
    //       // translate: 'NAV.DASHBOARDS',
    //       type: 'collapsable',
    //       icon: 'newViewListIcon',
    //       isSvgIcon: true,
    //       // icon: 'view_list',
    //       children: this.subChildren
    //     }
    //     );
    //   }
    //   this.navigation.push({
    //     id: 'applications',
    //     title: '',
    //     translate: 'NAV.APPLICATIONS',
    //     type: 'group',
    //     children: this.children
    //   });
    //   // Saving local Storage
    //   localStorage.setItem('menuItemsData', JSON.stringify(this.navigation));
    //   // Update the service in order to update menu
    //   this._menuUpdationService.PushNewMenus(this.navigation);
    // }

  }
}
