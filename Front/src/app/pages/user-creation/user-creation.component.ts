import { Component } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { UserWithRole } from '../../models/master';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ngx-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss']
})
export class UserCreationComponent {
  UserWithRole: UserWithRole[] = [];
  UserCreationFormGroup: FormGroup;
  selecteduser: UserWithRole;
  searchText = '';
  Active: any[] = [];
  userRole:any[]=[];
  isProgressBarVisibile: boolean;
  buttonhidden: boolean = true;
  selectID: string;
  notificationSnackBarComponent: any;
  hide = true;
  constructor(public snackBar: MatSnackBar,
    private _masterService: MasterService, private _formBuilder: FormBuilder, private dialog: MatDialog,) {
    this.Active = [
      "True",
      "False"
    ],
    this.userRole = [
      "Administrator",
      "Initiator"
    ]
    this.isProgressBarVisibile = true;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }
  ngOnInit(): void {
    this.GetAllUserWithRoles();
    this.InitializeCreateUserFormGroup();
  }
  GetAllUserWithRoles(): void {
    this.isProgressBarVisibile = true;
    this._masterService.GetAllUsers().subscribe(
      (data) => {
        this.isProgressBarVisibile = false;
        this.UserWithRole = <UserWithRole[]>data;
        this.loadSelectedUserCreationMaster(this.UserWithRole[0])
        console.log(this.UserWithRole);
      },
      (err) => {
        console.log(err);
        this.isProgressBarVisibile = false;
      }
    );
  }
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
  loadSelectedUserCreationMaster(selecteduser: UserWithRole): void {
    this.selectID = selecteduser.userName;
    this.selecteduser = selecteduser;
    console.log("this.selecteduser", this.selecteduser)

    this.SetOnBoardingFieldMasterValues();
  }
  ResetControl(): void {
    this.ResetuserFormGroup();
    this.buttonhidden = false;
  }
  ResetuserFormGroup(): void {
    this.ResetFormGroup(this.UserCreationFormGroup);
  }

  ResetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
      formGroup.get(key).markAsUntouched();
    });
  }
  InitializeCreateUserFormGroup(): void {
    this.UserCreationFormGroup = this._formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: [''],
      Email: ['', [Validators.required,Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      MobileNo: ['', [Validators.required,Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]],
      Active: ['', Validators.required],
      Password: ['', Validators.required],
      Role:['',Validators.required]
    })
  }
  SetOnBoardingFieldMasterValues(): void {
    this.UserCreationFormGroup.get('FirstName').patchValue(this.selecteduser.userName);
    this.UserCreationFormGroup.get('Email').patchValue(this.selecteduser.email);
    this.UserCreationFormGroup.get('MobileNo').patchValue(this.selecteduser.contactNumber);
    this.UserCreationFormGroup.get('Active').patchValue(this.selecteduser.isActive ? "True" : "False");
    this.UserCreationFormGroup.get('Password').patchValue(this.selecteduser.password);
    this.UserCreationFormGroup.get('LastName').patchValue(this.selecteduser.lastName);
    this.UserCreationFormGroup.get('Role').patchValue(this.selecteduser.role);

  }
  SaveClicked(): void {
    if (this.UserCreationFormGroup.valid) {
      this.GetUserValues();
      // this.SetActionToOpenConfirmation('Save');
     // this.buttonhidden = true;
    } else {
      this.ShowValidationErrors(this.UserCreationFormGroup);
    }
  }
  UpdateClicked():void{
    if(this.UserCreationFormGroup.valid){
      this.UpdateUser();
     //this.buttonhidden = true;

    }
    else{
      this.ShowValidationErrors(this.UserCreationFormGroup);
    }
  }
  UpdateUser():void{
    this.selecteduser.userName = this.UserCreationFormGroup.get('FirstName').value;
    this.selecteduser.email = this.UserCreationFormGroup.get('Email').value;
    this.selecteduser.contactNumber = this.UserCreationFormGroup.get('MobileNo').value;
    this.selecteduser.password = this.UserCreationFormGroup.get('Password').value;
    console.log("boolean : ",Boolean(this.UserCreationFormGroup.get('Active').value));
    this.selecteduser.isActive = this.UserCreationFormGroup.get('Active').value == "True" ? true :false ;
    this.selecteduser.lastName = this.UserCreationFormGroup.get('LastName').value;
    this.selecteduser.role = this.UserCreationFormGroup.get('Role').value;
   
    this.isProgressBarVisibile = true;
    this._masterService.UpdateUser(this.selecteduser).subscribe(
      (data) => {
        this.isProgressBarVisibile = false;
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar(`User Updated successfully`, SnackBarStatus.success);
        //this.IsProgressBarVisibile = false;
        this.buttonhidden = true;
        this.GetAllUserWithRoles();
      },
      (err) =>{
        console.log(err);
        this.notificationSnackBarComponent.openSnackBar(err, SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetAllUserWithRoles();
      }
    )
  }

  // SetActionToOpenConfirmation(Actiontype: string): void {
  //   const Catagory = 'User';
  //   this.OpenConfirmationDialog(Actiontype, Catagory);
  // }
  // OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
  //   const dialogConfig: MatDialogConfig = {
  //     data: {
  //       Actiontype: Actiontype,
  //       Catagory: Catagory
  //     },
  //     panelClass: 'confirmation-dialog'
  //   };
  //   const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(
  //     result => {
  //       if (result) {
  //         if (Actiontype === 'Save' || Actiontype === 'Update') {
  //           if (this.selecteduser.userName) {
  //             //this.UpdateUser(Actiontype);
  //             this.buttonhidden = true;
  //           } else {
  //             this.CreateUser(Actiontype);
  //           }
  //           // } else if (Actiontype === 'Delete') {
  //           //   this.DeleteUser();
  //           //   this.buttonhidden = true;
  //           // }
  //         }
  //       }
  //     });
  // }

  GetUserValues(): void {
    this.selecteduser.userName = this.UserCreationFormGroup.get('FirstName').value;
    this.selecteduser.email = this.UserCreationFormGroup.get('Email').value;
    this.selecteduser.contactNumber = this.UserCreationFormGroup.get('MobileNo').value;
    this.selecteduser.password = this.UserCreationFormGroup.get('Password').value;
    this.selecteduser.lastName = this.UserCreationFormGroup.get('LastName').value;
    this.selecteduser.isActive = Boolean(this.UserCreationFormGroup.get('Active').value);
    this.selecteduser.role = this.UserCreationFormGroup.get('Role').value;
    this.CreateUser(this.selecteduser);
    //this.selecteduser.userName = this.UserCreationFormGroup.get('FirstName').value;
  }
  CreateUser(selectedUser: UserWithRole): void {
    this.isProgressBarVisibile = true;
    this._masterService.CreateUser(selectedUser).subscribe(
      (data) => {
        if(data !=null){
          this.isProgressBarVisibile = false;
          this.ResetControl();
          this.notificationSnackBarComponent.openSnackBar(`User Saved successfully`, SnackBarStatus.success);
          //this.IsProgressBarVisibile = false;
          this.buttonhidden = true;
          this.GetAllUserWithRoles();
        }
        
      },
      (err) => {
        
        this.notificationSnackBarComponent.openSnackBar(err, SnackBarStatus.success);
        this.GetAllUserWithRoles();
        this.buttonhidden = true;
        this.isProgressBarVisibile = false;
      }
    );

  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
      if (formGroup.get(key) instanceof FormArray) {
        const FormArrayControls = formGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });

  }
  search(): UserWithRole[] {
    return this.UserWithRole.filter(item =>
      item.userName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
