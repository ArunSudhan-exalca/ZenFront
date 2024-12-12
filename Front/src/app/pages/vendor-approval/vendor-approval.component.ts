import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails } from '../../models/master';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BPVendorOnBoarding, BPVendorOnBoardingView, BPIdentity, BPBank, BPContact  } from '../../models/vendor-registration';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorRegistrationService } from '../../service/vendor-registration.service';
import { VendorMasterService } from '../../service/vendor-master.service';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { FileSaverService } from '../../service/file-saver.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { FileDetails } from '../../models/attachment';


@Component({
  selector: 'app-vendor-approval',
  templateUrl: './vendor-approval.component.html',
  styleUrls: ['./vendor-approval.component.scss']
})
export class VendorApprovalComponent implements OnInit {
  SelectedID: number;
  isReadOnly :boolean = true;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  vendorRegistrationFormGroup: FormGroup;
  identificationFormGroup: FormGroup;
  bankDetailsFormGroup: FormGroup;
  contactFormGroup: FormGroup;
  AllVendorOnBoardings: BPVendorOnBoarding[] = [];
  SelectedBPVendorOnBoarding: BPVendorOnBoarding;
  SelectedBPVendorOnBoardingView: BPVendorOnBoardingView;
  IdentificationsByVOB: BPIdentity[] = [];
  BanksByVOB: BPBank[] = [];
  ContactsByVOB: BPContact[] = [];
  identificationDisplayedColumns: string[] = [
   
    'Type',
    'IDNumber',
    'Attachment',
    'Size',
    'Date',
  ];
  bankDetailsDisplayedColumns: string[] = [
    
    'AccountNo',
    'IFSC',
    'BankName',
    'Branch',
    'City',
  ];

  contactDisplayedColumns: string[] = [
    
    'Name',
    'Department',
    'Title',
    'Mobile',
    'Email',
  ];
  identificationDataSource = new MatTableDataSource<BPIdentity>();
  bankDetailsDataSource = new MatTableDataSource<BPBank>();
  contactDataSource = new MatTableDataSource<BPContact>();
  BPVendorOnBoarding: BPVendorOnBoarding;
  AllIdentityTypes: string[] = [];
  constructor(
    private _vendorRegistrationService: VendorRegistrationService, public dialog: MatDialog,
    private _vendorMasterService: VendorMasterService,
     public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,private _fileSaver: FileSaverService,
  ) {
    this.SelectedBPVendorOnBoarding = new BPVendorOnBoarding();
    this.SelectedBPVendorOnBoardingView = new BPVendorOnBoardingView();
    this.authenticationDetails = new AuthenticationDetails();
     this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
   
  }

  ngOnInit(): void {
    this.SelectedID = JSON.parse(localStorage.getItem('TransID'));
    if (this.SelectedID) {
      this.GetVendorOnBoardingsByID();
    }
    this.GetAllIdentityTypes();
    this.InitializeVendorRegistrationFormGroup();
    this.InitializeIdentificationFormGroup();
    this.InitializeBankDetailsFormGroup();
   // this.InitializeContactFormGroup();
  }

  GetVendorOnBoardingsByID(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.GetVendorOnBoardingsByID(this.SelectedID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.BPVendorOnBoarding = <BPVendorOnBoarding>data;
        console.log("314 : ",this.BPVendorOnBoarding);
        if (this.BPVendorOnBoarding) {
          this.loadSelectedBPVendorOnBoarding(this.BPVendorOnBoarding);
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
 
  GetAllIdentityTypes(): void {
    this._vendorMasterService.GetAllIdentityTypes().subscribe(
      (data) => {
        this.AllIdentityTypes = data as string[];
       
      },
      (err) => {
        console.error(err);
      }
    );
  }
 
  InitializeVendorRegistrationFormGroup(): void {
    this.vendorRegistrationFormGroup = this._formBuilder.group({
      Name: [''],
    
      AddressLine1:[''],
      AddressLine2:[''],
      AddressLine3:[''],
      AddressLine4:[''],
      AddressLine5:[''],
      // BuildingNumber: ['', Validators.required],
      // Street: ['', Validators.required],
       City: [''],
      // Area:['', Validators.required],
      // LandMark:['',Validators.required],
      StateCode: [''],
      GST: [''],
      PAN:[''],
      MSMEType: [''],
      // TypeOfIndustry: [''],
      Country: ['India'],
      PinCode: [''],
      CertificateNo:[''],
      ValidFrom:[''],
      ValidTo:[''],
      RegisterCity:[''],
      // Status:[''],
      PrimaryContact: [''],
      SecondaryContact: [''],
      Primarymail: [''],
      Secondarymail: [''],

    });
  }
 


  InitializeIdentificationFormGroup(): void {
    this.identificationFormGroup = this._formBuilder.group({
      Type: [''],
      IDNumber: [''],
      ValidUntil: [''],
    });
  }
 
  InitializeBankDetailsFormGroup(): void {
    this.bankDetailsFormGroup = this._formBuilder.group({
      AccountNo: [''],
      IFSC: [''],
      BankName: [''],
      Branch: [''],
      City: [''],
    });
  }

  // InitializeContactFormGroup(): void {
  //   this.contactFormGroup = this._formBuilder.group({
  //     Name: ['', Validators.required],
  //     Department: ['', Validators.required],
  //     Title: ['', Validators.required],
  //     Mobile: ['', [Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]],
  //     Email: ['', [Validators.required, Validators.email]],
  //   });
  // }

 

  GetRegisteredVendorOnBoardings(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.GetRegisteredVendorOnBoardings().subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
        if (this.AllVendorOnBoardings && this.AllVendorOnBoardings.length) {
          this.loadSelectedBPVendorOnBoarding(this.AllVendorOnBoardings[0]);
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedBPVendorOnBoarding(selectedBPVendorOnBoarding: BPVendorOnBoarding): void {
    this.SelectedBPVendorOnBoarding = selectedBPVendorOnBoarding;
    this.SetBPVendorOnBoardingValues();
    this.GetBPVendorOnBoardingSubItems();
  }

  

  SetBPVendorOnBoardingValues(): void {
    this.vendorRegistrationFormGroup.get('Name').patchValue(this.SelectedBPVendorOnBoarding.name);
    this.vendorRegistrationFormGroup.get('GST').patchValue(this.SelectedBPVendorOnBoarding.gstNumber);
    this.vendorRegistrationFormGroup.get('AddressLine1').patchValue(this.SelectedBPVendorOnBoarding.addressLine1);
    this.vendorRegistrationFormGroup.get('AddressLine2').patchValue(this.SelectedBPVendorOnBoarding.addressLine2);
    this.vendorRegistrationFormGroup.get('AddressLine3').patchValue(this.SelectedBPVendorOnBoarding.addressLine3);
    this.vendorRegistrationFormGroup.get('AddressLine4').patchValue(this.SelectedBPVendorOnBoarding.addressLine4);
    this.vendorRegistrationFormGroup.get('AddressLine5').patchValue(this.SelectedBPVendorOnBoarding.addressLine5);
    this.vendorRegistrationFormGroup.get('PinCode').patchValue(this.SelectedBPVendorOnBoarding.pinCode);
    this.vendorRegistrationFormGroup.get('City').patchValue(this.SelectedBPVendorOnBoarding.city);
    this.vendorRegistrationFormGroup.get('StateCode').patchValue(this.SelectedBPVendorOnBoarding.stateCode)
   
    this.vendorRegistrationFormGroup.get('Country').patchValue(this.SelectedBPVendorOnBoarding.country);
    this.vendorRegistrationFormGroup.get('PrimaryContact').patchValue(this.SelectedBPVendorOnBoarding.primaryContact);
    this.vendorRegistrationFormGroup.get('SecondaryContact').patchValue(this.SelectedBPVendorOnBoarding.secondaryContact);
    this.vendorRegistrationFormGroup.get('Primarymail').patchValue(this.SelectedBPVendorOnBoarding.primarymail);
    this.vendorRegistrationFormGroup.get('Secondarymail').patchValue(this.SelectedBPVendorOnBoarding.secondarymail);
    this.vendorRegistrationFormGroup.get('CertificateNo').patchValue(this.SelectedBPVendorOnBoarding.certificateNo);
    this.vendorRegistrationFormGroup.get('GST').patchValue(this.SelectedBPVendorOnBoarding.gstNumber);
    this.vendorRegistrationFormGroup.get('PAN').patchValue(this.SelectedBPVendorOnBoarding.panNumber);
    if(this.SelectedBPVendorOnBoarding.validFrom != null){
      this.vendorRegistrationFormGroup.get('ValidFrom').patchValue(this.SelectedBPVendorOnBoarding.validFrom.toString().substring(0, 10));

    }
    else{
      this.vendorRegistrationFormGroup.get('ValidFrom').patchValue(this.SelectedBPVendorOnBoarding.validFrom);
    }
    if(this.SelectedBPVendorOnBoarding.validFrom != null){
      this.vendorRegistrationFormGroup.get('ValidTo').patchValue(this.SelectedBPVendorOnBoarding.validTo.toString().substring(0, 10));
    }
    else{
      this.vendorRegistrationFormGroup.get('ValidTo').patchValue(this.SelectedBPVendorOnBoarding.validTo);    }
   
    this.vendorRegistrationFormGroup.get('RegisterCity').patchValue(this.SelectedBPVendorOnBoarding.registeredCity);
   
    let MSMEType = this.SelectedBPVendorOnBoarding.msmE_TYPE;
    if (MSMEType === "INMIC") {
      this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Micro Enterprise");
    } else if (MSMEType === "INSML") {
      this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Small Enterprise");
    } else if (MSMEType === "INMID") {
      this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Medium Enterprise");
    } else if (MSMEType === "INLEL") {
      this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Legal Entity Identifier");
    }
    else {
      this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Not Applicable");
    }
  }

  GetBPVendorOnBoardingSubItems(): void {
    this.GetIdentificationsByVOB();
    this.GetBanksByVOB();
   // this.GetContactsByVOB();
  }

  GetIdentificationsByVOB(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.GetIdentificationsByVOB(this.SelectedBPVendorOnBoarding.transID).subscribe(
      (data) => {
        
        this.IdentificationsByVOB = data as BPIdentity[];
        console.log(" this.IdentificationsByVOB", this.IdentificationsByVOB)
        this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = true;
         this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetBanksByVOB(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.GetBanksByVOB(this.SelectedBPVendorOnBoarding.transID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.BanksByVOB = data as BPBank[];
        this.bankDetailsDataSource = new MatTableDataSource(this.BanksByVOB);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = true;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  // GetContactsByVOB(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._vendorRegistrationService.GetContactsByVOB(this.SelectedBPVendorOnBoarding.transID).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //       this.ContactsByVOB = data as BPContact[];
  //       this.contactDataSource = new MatTableDataSource(this.ContactsByVOB);
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }
  GetBPVendorOnBoardingValues(): void {
    this.SelectedBPVendorOnBoarding.name = this.SelectedBPVendorOnBoardingView.name = this.vendorRegistrationFormGroup.get('Name').value;
    this.SelectedBPVendorOnBoarding.addressLine1 = this.SelectedBPVendorOnBoardingView.addressLine1 = this.vendorRegistrationFormGroup.get('AddressLine1').value;
    this.SelectedBPVendorOnBoarding.addressLine2 = this.SelectedBPVendorOnBoardingView.addressLine2 = this.vendorRegistrationFormGroup.get('AddressLine2').value;
    this.SelectedBPVendorOnBoarding.addressLine3 = this.SelectedBPVendorOnBoardingView.addressLine3 = this.vendorRegistrationFormGroup.get('AddressLine3').value;
    this.SelectedBPVendorOnBoarding.addressLine4 = this.SelectedBPVendorOnBoardingView.addressLine4 = this.vendorRegistrationFormGroup.get('AddressLine4').value;
    this.SelectedBPVendorOnBoarding.addressLine5 = this.SelectedBPVendorOnBoardingView.addressLine5 = this.vendorRegistrationFormGroup.get('AddressLine5').value;

    this.SelectedBPVendorOnBoarding.city = this.SelectedBPVendorOnBoardingView.city = this.vendorRegistrationFormGroup.get('City').value;
    // this.SelectedBPVendorOnBoarding.state = this.SelectedBPVendorOnBoardingView.state = this.vendorRegistrationFormGroup.get('State').value;
    this.SelectedBPVendorOnBoarding.country = this.SelectedBPVendorOnBoardingView.country = this.vendorRegistrationFormGroup.get('Country').value;
    this.SelectedBPVendorOnBoarding.primaryContact = this.SelectedBPVendorOnBoardingView.primaryContact = this.vendorRegistrationFormGroup.get('PrimaryContact').value;
    this.SelectedBPVendorOnBoarding.secondaryContact = this.SelectedBPVendorOnBoardingView.secondaryContact = this.vendorRegistrationFormGroup.get('SecondaryContact').value;
    this.SelectedBPVendorOnBoarding.primarymail = this.SelectedBPVendorOnBoardingView.primarymail = this.vendorRegistrationFormGroup.get('Primarymail').value;
    this.SelectedBPVendorOnBoarding.secondarymail = this.SelectedBPVendorOnBoardingView.secondarymail = this.vendorRegistrationFormGroup.get('Secondarymail').value;
   }

  GetBPVendorOnBoardingSubItemValues(): void {
    this.GetBPIdentityValues();
    this.GetBPBankValues();
    this.GetBPContactValues();
  }

  GetBPIdentityValues(): void {
    // this.SelectedBPVendorOnBoardingView.bPIdentities = [];
    // this.IdentificationsByVOB.forEach(x => {
    //   this.SelectedBPVendorOnBoardingView.bPIdentities.push(x);
    // });
  }

  GetBPBankValues(): void {
    this.SelectedBPVendorOnBoardingView.bPBanks = [];
    this.BanksByVOB.forEach(x => {
      this.SelectedBPVendorOnBoardingView.bPBanks.push(x);
    });
  }

  GetBPContactValues(): void {
    this.SelectedBPVendorOnBoardingView.bPContacts = [];
    this.ContactsByVOB.forEach(x => {
      this.SelectedBPVendorOnBoardingView.bPContacts.push(x);
    });
  }
  getFile(filename):void{
    
    var ext = filename.attachmentName.substr(filename.attachmentName.lastIndexOf('.') + 1);
    if(ext != "pdf"){
      const dialogConfig: MatDialogConfig = {
        data: {
          FileName: filename.attachmentName,
          FileContent: filename.attachmentFile,
          FileType:filename.contentType
        },
        panelClass: "dialog-box-document",
        autoFocus : false
      };
      const dialogRef = this.dialog.open(AttachmentDialogComponent,dialogConfig);
      dialogRef.afterClosed().subscribe()
    }
    else{
      let res = new FileDetails();
      res.FileContent = filename.attachmentFile;
      res.FileType = filename.contentType;
      res.FileName = filename.attachmentName;
      this._fileSaver.downloadFile(res)
    }
    
  }
}
