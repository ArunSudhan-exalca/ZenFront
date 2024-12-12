import {Component, Inject} from '@angular/core';
// import { fuseAnimations } from '@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EMailModel} from '../../models/master';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationSnackBarComponent} from '../notification-snack-bar/notification-snack-bar.component';
import {environment} from "../../../environments/environment";
import {SnackBarStatus} from "../notification-snack-bar/notification-snackbar-status-enum";
// import { WINDOW } from 'app/window.providers';

// import { window } from 'rxjs/operators';}
// import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'ngx-forget-password-link-dialog',
  templateUrl: './forget-password-link-dialog.component.html',
  styleUrls: ['./forget-password-link-dialog.component.scss']
})
export class ForgetPasswordLinkDialogComponent {

    forgotPasswordForm: FormGroup;
    Origin: string;
    emailModel: EMailModel;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    private _router: any;

    constructor(
      public matDialogRef: MatDialogRef<ForgetPasswordLinkDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _formBuilder: FormBuilder,
      public snackBar: MatSnackBar,
      // @Inject(Window) private window: Window
      // @Inject(Window) private window: Window
    ) {
      this.forgotPasswordForm = this._formBuilder.group({
        // email: ['', [Validators.required, Validators.email]]
        UserName: ['', Validators.required]
      });
    }

    ngOnInit(): void {
      // if (isDevMode()) {
      //   this.Origin = this.window.location.origin;
      // } else {
      //   this.Origin = this.window.location.origin;
      // }
      // this.Origin = this.window.location.origin;
    }
    YesClicked(): void {
      if (this.forgotPasswordForm.valid) {
        this.emailModel = new EMailModel();
        // this.emailModel.EmailAddress = this.forgotPasswordForm.get('email').value;
        // this.emailModel.EmailAddress = this.emailModel.EmailAddress.toLocaleLowerCase();
        this.emailModel.UserName = this.forgotPasswordForm.get('UserName').value;
        // const Origin = (this._platformLocation as any).location.origin;
        this.Origin = environment.baseadd;
        this.emailModel.siteURL = `${this.Origin}/#/auth/forgotPassword`;

        this.openSnackBar('Reset link send successfully',SnackBarStatus.success)

        //this.snackBar.open('Reset link send successfully');
        this.matDialogRef.close(this.emailModel);


      } else {
        Object.keys(this.forgotPasswordForm.controls).forEach(key => {
          this.forgotPasswordForm.get(key).markAsTouched();
          this.forgotPasswordForm.get(key).markAsDirty();
        });

      }
    }

    CloseClicked(): void {
      this.matDialogRef.close(null);
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

