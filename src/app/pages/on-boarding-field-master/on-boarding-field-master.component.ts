import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationDetails } from '../../models/master';
import { CBPFieldMaster } from '../../models/vendor-master';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { MasterService } from '../../service/master.service';
import { DatePipe } from '@angular/common';
import { VendorMasterService } from '../../service/vendor-master.service';
@Component({
  selector: 'ngx-on-boarding-field-master',
  templateUrl: './on-boarding-field-master.component.html',
  styleUrls: ['./on-boarding-field-master.component.scss']
})
export class OnBoardingFieldMasterComponent implements OnInit {
 // getvalue:string;
  AllOnBoardingFieldMasters: CBPFieldMaster[] = [];
  AllExtensions: string[] = [];
  MandatoryList: any[] = [];
  selectedOnBoardingFieldMaster: CBPFieldMaster;
  menuItems: string[];
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  selectID: number;
  OnBoardingFieldMasterFormGroup: FormGroup;
  searchText = '';
  constructor(
    private _vendorMasterService: VendorMasterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog, private _datePipe: DatePipe,
    private _formBuilder: FormBuilder) {
    this.selectedOnBoardingFieldMaster = new CBPFieldMaster();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = true;
    }

  ngOnInit(): void {
    // Retrive authorizationData
    // this.getvalue  = localStorage.getItem('Reloaddata')
    // if(this.getvalue == "true"){
    //   window.location.reload();
    //   localStorage.setItem('Reloaddata',JSON.stringify(false))
    // }
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.menuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.menuItems.indexOf('OBD Field Master') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
      this.InitializeOnBoardingFieldMasterFormGroup();
      this.InitializeMandatoryList();
      this.GetAllOnBoardingFieldMasters();
      
    } else {
      this._router.navigate(['/auth/login']);
    }

  }
  InitializeOnBoardingFieldMasterFormGroup(): void {
    this.OnBoardingFieldMasterFormGroup = this._formBuilder.group({
      Field: ['', Validators.required],
      Text: ['', Validators.required],
      DefaultValue: [''],
      Mandatory: ['', [Validators.required]],
      Invisible: ['', [Validators.required]],
    });
    this.OnBoardingFieldMasterFormGroup.get('Field').disable();
  }

  ResetControl(): void {
    this.selectedOnBoardingFieldMaster = new CBPFieldMaster();
    this.selectID = 0;
    this.OnBoardingFieldMasterFormGroup.reset();
    Object.keys(this.OnBoardingFieldMasterFormGroup.controls).forEach(key => {
      this.OnBoardingFieldMasterFormGroup.get(key).markAsUntouched();
    });
    // this.fileToUpload = null;
  }
  InitializeAllExtensions(): void {
    this.AllExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'svg', 'tif', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'];
  }
  InitializeMandatoryList(): void {
    this.MandatoryList = [{ Key: 'Yes', Value: true }, { Key: 'No', Value: false }];
  }
  GetAllOnBoardingFieldMasters(): void {
    this.isProgressBarVisibile = true;
    this._vendorMasterService.GetAllOnBoardingFieldMaster().subscribe(
      (data) => {
        this.isProgressBarVisibile = false;
        this.AllOnBoardingFieldMasters = <CBPFieldMaster[]>data;
       
        if (this.AllOnBoardingFieldMasters && this.AllOnBoardingFieldMasters.length) {
          this.loadSelectedOnBoardingFieldMaster(this.AllOnBoardingFieldMasters[0]);
        }
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedOnBoardingFieldMaster(selectedOnBoardingFieldMaster: CBPFieldMaster): void {
    this.selectID = selectedOnBoardingFieldMaster.ID;
    this.selectedOnBoardingFieldMaster = selectedOnBoardingFieldMaster;
    this.SetOnBoardingFieldMasterValues();
    //window.location.reload();
  }

  SetOnBoardingFieldMasterValues(): void {
    this.OnBoardingFieldMasterFormGroup.get('Field').patchValue(this.selectedOnBoardingFieldMaster.field);
    this.OnBoardingFieldMasterFormGroup.get('Text').patchValue(this.selectedOnBoardingFieldMaster.text);
    this.OnBoardingFieldMasterFormGroup.get('DefaultValue').patchValue(this.selectedOnBoardingFieldMaster.defaultValue);
    this.OnBoardingFieldMasterFormGroup.get('Mandatory').patchValue(this.selectedOnBoardingFieldMaster.mandatory);
    this.OnBoardingFieldMasterFormGroup.get('Invisible').patchValue(this.selectedOnBoardingFieldMaster.invisible);
    this.OnBoardingFieldMasterFormGroup.get('Field').disable();
    
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
      || charCode === 37 || charCode === 39 || charCode === 123) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }
  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Create') {
            // this.CreateOnBoardingFieldMaster();
          } else if (Actiontype === 'Update') {
            this.UpdateOnBoardingFieldMaster();
          } else if (Actiontype === 'Delete') {
            // this.DeleteOnBoardingFieldMaster();
          }
        }
      });
  }

  GetOnBoardingFieldMasterValues(): void {
    this.selectedOnBoardingFieldMaster.field = this.OnBoardingFieldMasterFormGroup.get('Field').value;
    this.selectedOnBoardingFieldMaster.fieldName = this.OnBoardingFieldMasterFormGroup.get('Field').value;
    this.selectedOnBoardingFieldMaster.text = this.OnBoardingFieldMasterFormGroup.get('Text').value;
    this.selectedOnBoardingFieldMaster.defaultValue = this.OnBoardingFieldMasterFormGroup.get('DefaultValue').value;
    this.selectedOnBoardingFieldMaster.mandatory = this.OnBoardingFieldMasterFormGroup.get('Mandatory').value;
    this.selectedOnBoardingFieldMaster.invisible = this.OnBoardingFieldMasterFormGroup.get('Invisible').value;
  }

  // CreateOnBoardingFieldMaster(): void {
  //   this.GetOnBoardingFieldMasterValues();
  //   this.selectedOnBoardingFieldMaster.CreatedBy = this.authenticationDetails.UserID.toString();
  //   this.isProgressBarVisibile = true;
  //   this._masterService.CreateOnBoardingFieldMaster(this.selectedOnBoardingFieldMaster).subscribe(
  //     (data) => {
  //       // console.log(data);
  //       this.ResetControl();
  //       this.notificationSnackBarComponent.openSnackBar('Document Type Master created successfully', SnackBarStatus.success);
  //       this.isProgressBarVisibile = false;
  //       this.GetAllOnBoardingFieldMasters();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       this.isProgressBarVisibile = false;
  //     }
  //   );

  // }

  UpdateOnBoardingFieldMaster(): void {
    this.GetOnBoardingFieldMasterValues();
    this.selectedOnBoardingFieldMaster.modifiedBy = this.authenticationDetails.userID.toString();
    this.isProgressBarVisibile = true;
    this._vendorMasterService.UpdateOnBoardingFieldMaster(this.selectedOnBoardingFieldMaster).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('OnBoarding Field Configuration updated successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetAllOnBoardingFieldMasters();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  // DeleteOnBoardingFieldMaster(): void {
  //   this.GetOnBoardingFieldMasterValues();
  //   this.selectedOnBoardingFieldMaster.ModifiedBy = this.authenticationDetails.UserID.toString();
  //   this.isProgressBarVisibile = true;
  //   this._masterService.DeleteOnBoardingFieldMaster(this.selectedOnBoardingFieldMaster).subscribe(
  //     (data) => {
  //       // console.log(data);
  //       this.ResetControl();
  //       this.notificationSnackBarComponent.openSnackBar('Document Type Master deleted successfully', SnackBarStatus.success);
  //       this.isProgressBarVisibile = false;
  //       this.GetAllOnBoardingFieldMasters();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       this.isProgressBarVisibile = false;
  //     }
  //   );
  // }

  ShowValidationErrors(): void {
    Object.keys(this.OnBoardingFieldMasterFormGroup.controls).forEach(key => {
      this.OnBoardingFieldMasterFormGroup.get(key).markAsTouched();
      this.OnBoardingFieldMasterFormGroup.get(key).markAsDirty();
    });

  }

  SaveClicked(): void {
    if (this.OnBoardingFieldMasterFormGroup.valid) {
      // const file: File = this.fileToUpload;
      if (this.selectedOnBoardingFieldMaster.ID) {
        const Actiontype = 'Update';
        const Catagory = 'Document type Master';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'Document type Master';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      }
    } else {
      this.ShowValidationErrors();
    }
  }

  // DeleteClicked(): void {
  //   if (this.OnBoardingFieldMasterFormGroup.valid) {
  //     if (this.selectedOnBoardingFieldMaster.ID) {
  //       const Actiontype = 'Delete';
  //       const Catagory = 'Document type Master';
  //       this.OpenConfirmationDialog(Actiontype, Catagory);
  //     }
  //   } else {
  //     this.ShowValidationErrors();
  //   }
  // }


}


// @Component({
//   selector: 'ngx-on-boarding-field-master',
//   templateUrl: './on-boarding-field-master.component.html',
//   styleUrls: ['./on-boarding-field-master.component.scss']
// })



// export class OnBoardingFieldMasterComponent {

// }
