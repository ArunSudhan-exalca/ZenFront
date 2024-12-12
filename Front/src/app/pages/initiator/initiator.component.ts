import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorMasterService } from '../../service/vendor-master.service';
import { VendorRegistrationService } from '../../service/vendor-registration.service';
import { AccountGroup, IntiatiorDetails, VendorInitialzation } from '../../models/vendor-registration';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { Observable, of } from 'rxjs';


import { map, startWith } from 'rxjs/operators';
import { AuthenticationDetails } from '../../models/master';

@Component({
  selector: 'ngx-initiator',
  templateUrl: './initiator.component.html',
  styleUrls: ['./initiator.component.scss']
})
export class InitiatorComponent {
  CompanyCode: any[] = [];
  PurchaseGroup: any[] = [];
  PurchasegroupselectedItem: string;
  CompanyselectedItem: string;
  AccountGroup: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionscompany: Observable<string[]>;
  // PlantCode:string[]=[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  Gst: string[] = [];
  data: any;
  combinedArray: string[] = [];
  IntiatiorFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  IntiatorVendorOnboarding: VendorInitialzation;
  intiatior: IntiatiorDetails[] = [];
  currentUsermail :string ="";
  currentUserName:string="";
  authenticationDetails: AuthenticationDetails;
  constructor(private _formBuilder: FormBuilder, public snackBar: MatSnackBar, private _vendorRegistrationService: VendorRegistrationService) {
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }
  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUsermail = this.authenticationDetails.emailAddress;
      this.currentUserName = this.authenticationDetails.userName;
      console.log("this.authenticationDetails.EmailAddress : ",this.authenticationDetails.emailAddress)
      
      // if (this.MenuItems.indexOf('Identity') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } 
    this.InitializeIntiatiorFormGroup();
    this.GetAllCompanyandAccount();


  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.PurchaseGroup.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }
  private filterCompany(value: string): string[] {
    const filterValue1 = value.toLowerCase();
    return this.CompanyCode.filter(optionValue => optionValue.toLowerCase().includes(filterValue1));
  }
  viewHandle(value: string) {
    return value.toUpperCase();
  }
  InitializeIntiatiorFormGroup(): void {
    this.IntiatiorFormGroup = this._formBuilder.group({
      CompanyGroup: [''],
      PurachseGroup: [''],
      AccountGroup: ['', Validators.required],
      GSTValue: ['', Validators.required],
      //Plant:['',Validators.required],
      Name: ['', Validators.required],
      Email: ['', Validators.required],
    })
  }
  GetAllCompanyandAccount(): void {
    this.IsProgressBarVisibile = true;

    this._vendorRegistrationService.GetAllCompanyAndAccount().subscribe(
      (data) => {
        this.data = data;
        console.log(this.data);
        if (this.data.acC_Key.length && this.data.acC_Key.length != 0) {
          for (let i = 0; i < this.data.acC_Key.length; i++) {
            this.AccountGroup.push(`${this.data.acC_Key[i]} - ${this.data.acC_Value[i]}`);
          }

        }
        if (this.data.company_Key.length && this.data.company_Key.length != 0) {
          for (let i = 0; i < this.data.company_Key.length; i++) {
            this.CompanyCode.push(`${this.data.company_Key[i]} - ${this.data.company_Value[i]}`);
            if (this.data.company_Key[i] == "6300") {
              this.CompanyselectedItem = this.data.company_Key[i] + " - " + this.data.company_Value[i];
            }
          }
          this.filteredOptionscompany = of(this.CompanyCode);
          this.filteredOptionscompany = this.IntiatiorFormGroup.get('CompanyGroup').valueChanges
            .pipe(
              startWith(''),
              map(filterString1 => this.filterCompany(filterString1)),
            );
        }
        if (this.data.purchaseGrp_Key.length && this.data.purchaseGrp_Key.length != 0) {
          for (let i = 0; i < this.data.purchaseGrp_Key.length; i++) {
            this.PurchaseGroup.push(`${this.data.purchaseGrp_Key[i]} - ${this.data.purchaseGrp_Value[i]}`);
            if (this.data.purchaseGrp_Key[i] == "6300") {
              this.PurchasegroupselectedItem = this.data.purchaseGrp_Key[i] + " - " + this.data.purchaseGrp_Value[i];
              //  console.log("this.PurchasegroupselectedItem : ",this.PurchasegroupselectedItem)
            }
          }
          this.filteredOptions = of(this.PurchaseGroup);
          this.filteredOptions = this.IntiatiorFormGroup.get('PurachseGroup').valueChanges
            .pipe(
              startWith(''),
              map(filterString => this.filter(filterString)),
            );
        }

        if (this.data.gst_Key.length && this.data.gst_Key.length != 0) {
          for (let i = 1; i < this.data.gst_Key.length; i++) {
            if (this.data.gst_Key[i] != "" && this.data.gst_Value[i] != "") {
              this.Gst.push(`${this.data.gst_Key[i]} - ${this.data.gst_Value[i]}`);
            }
            else if (this.data.gst_Key[i] == "") {
              this.Gst.push(this.data.gst_Value[i]);
            }

          }
        }
        




        // for (let i=0;i<this.data.plant_Code.length;i++){
        //   this.PlantCode.push(`${this.data.plant_Code[i]} - ${this.data.plant_desc[i]}`)
        // }
        this.IsProgressBarVisibile = false;

      })
  }
  SubmitClicked(): void {
    if (this.IntiatiorFormGroup.valid) {
      this.IntiatorVendorOnboarding = new VendorInitialzation();
      this.IntiatorVendorOnboarding.AccountGroup = this.IntiatiorFormGroup.get('AccountGroup').value;
      this.IntiatorVendorOnboarding.CompanyCode = this.IntiatiorFormGroup.get('CompanyGroup').value == "" ? this.CompanyselectedItem : this.IntiatiorFormGroup.get('CompanyGroup').value;
this.IntiatorVendorOnboarding.CreatedUsername = this.currentUserName;
this.IntiatorVendorOnboarding.CreatedMailID = this.currentUsermail;
      this.IntiatorVendorOnboarding.GSTValue = this.IntiatiorFormGroup.get('GSTValue').value;
      this.IntiatorVendorOnboarding.Email = this.IntiatiorFormGroup.get('Email').value;
      this.IntiatorVendorOnboarding.Name = this.IntiatiorFormGroup.get('Name').value;
      this.IntiatorVendorOnboarding.PurchaseOrg = this.IntiatiorFormGroup.get('PurachseGroup').value == "" ? this.PurchasegroupselectedItem : this.IntiatiorFormGroup.get('PurachseGroup').value;
      //this.IntiatorVendorOnboarding.Plant = this.IntiatiorFormGroup.get('Plant').value;
      this.IsProgressBarVisibile = true;
      this._vendorRegistrationService.InitiateVendorOnBoarding(this.IntiatorVendorOnboarding).subscribe(
        (data) => {
          this.IntiatiorFormGroup.reset();
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Request Sent successfully', SnackBarStatus.success, 2000);
        }

      )
    }
    else {
      this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Something went wrong', SnackBarStatus.success, 2000);
      this.ShowValidationErrors(this.IntiatiorFormGroup);
    }

  }
  ShowValidationErrors(formGroup: FormGroup): void {
    let first = false;
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
        // if (!first) {
        //   const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        //   // invalidControl.focus();
        //   first = true;
        // }
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
}
