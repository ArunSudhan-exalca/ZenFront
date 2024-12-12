import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationDetails, MenuApp, VendorUser } from '../../models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnswerList, Answers, BPActivityLog, BPBank, BPContact, BPIdentity, BPVendorOnBoarding, BPVendorOnBoardingView, QAnswerChoice, Question, QuestionAnswersView, QuestionnaireResultSet, VendorTokenCheck } from '../../models/vendor-registration';
import { CBPBank, CBPDepartment, CBPFieldMaster, CBPIdentity, CBPIdentityFieldMaster, CBPLocation, CountryDetails, GSTFields, StateDetails } from '../../models/vendor-master';
import { Observable, identity, of } from 'rxjs';
import { MasterService } from '../../service/master.service';
import { VendorRegistrationService } from '../../service/vendor-registration.service';
import { VendorMasterService } from '../../service/vendor-master.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { AttachmentDetails } from '../../models/attachment';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';
import { NbDateService } from '@nebular/theme';
import { ThisReceiver } from '@angular/compiler';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';





@Component({
  selector: 'ngx-vendor-register',
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.scss']
})
export class VendorRegisterComponent implements OnInit {
  cancelcheque: boolean = false;
  MenuItems: string[];
  AllMenuApps: MenuApp[] = [];
  Departments: any[] = [];
  SelectedMenuApp: MenuApp;
  pangstvalidate: boolean = false;
  id: string;
  today: Date = new Date();
  DeptValue = "";
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  hiddenoption: boolean = false;
  vendorRegistrationFormGroup: FormGroup;
  InitiatorFormGroup: FormGroup
  identificationFormGroup: FormGroup;
  bankDetailsFormGroup: FormGroup;
  contactFormGroup: FormGroup;
  questionFormGroup: FormGroup;
  questionsFormArray: FormArray = this._formBuilder.array([]);
  activityLogFormGroup: FormGroup;
  searchText = '';
  selectID: number;
  SelectedBPVendorOnBoarding: BPVendorOnBoarding;
  SelectedBPVendorOnBoardingView: BPVendorOnBoardingView;
  AllQuestionnaireResultSet: QuestionnaireResultSet = new QuestionnaireResultSet();
  AllQuestionAnswersView: QuestionAnswersView[] = [];
  AllQuestions: Question[] = [];
  SelectedQRID: number;
  AllQuestionAnswerChoices: QAnswerChoice[] = [];
  AllQuestionAnswers: Answers[] = [];
  answerList: AnswerList;
  QuestionID: any;
  IdentificationsByVOB: BPIdentity[] = [];
  BanksByVOB: BPBank[] = [];
  ContactsByVOB: BPContact[] = [];
  CBPIdentity: CBPIdentityFieldMaster[] = [];
  MSMEMandatory = false;
  GSTAttachment: boolean = false;
  MSMEAttachement: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  IdentityRowSelectedIndex = null;
  GSTStatusCode: any;
  VendorType = '';
  ActivityLogsByVOB: BPActivityLog[] = [];
  documenttype: number = -1;
  identificationDisplayedColumns: string[] = [
    'select',
    'Type',
    'IDNumber',
    'Attachment',
    'Size',
    'Date',
    'Action'
  ];

  bankDetailsDisplayedColumns: string[] = [
    'select',
    'IFSC',
    'AccountNo',
    'BankName',
    'city',
    'Branch',
    'Action'
  ];
  contactDisplayedColumns: string[] = [
    'select',
    'Name',
    'department',
    'Title',
    'Mobile',
    'Email',
    'Action'
  ];
  data: any;
  regionData: StateDetails[] = [];
  regionDatas: StateDetails[] = [];
  CountryDetail: CountryDetails[] = [];
  CountryDetails: CountryDetails[] = [];
  CountryData: string[] = [];
  countrydesc: string[] = [];
  regiondesc: string[] = [];
  lengthOfPincode: number;
  regionCountry: string[] = [];
  pincodelength: string[] = [];
  SelectedIdentity: BPIdentity;
  SelectedBank: BPBank;
  identificationDataSource = new MatTableDataSource<BPIdentity>();
  bankDetailsDataSource = new MatTableDataSource<BPBank>();
  contactDataSource = new MatTableDataSource<BPContact>();
  activityLogDataSource = new MatTableDataSource<BPActivityLog>();
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  selection2 = new SelectionModel<any>(true, []);
  @ViewChild('iDNumber') iDNumber: ElementRef;
  @ViewChild('validUntil') validUntil: ElementRef;
  @ViewChild('accountNo') accountNo: ElementRef;
  @ViewChild('ifsc') ifsc: ElementRef;
  @ViewChild('bankName') bankName: ElementRef;
  @ViewChild('branch') branch: ElementRef;
  @ViewChild('bankCity') bankCity: ElementRef;



  @ViewChild('autoInput') input;
  @ViewChild('autoInputregion') autoInputregion;
  // @ViewChild('fileInput1') fileInput: ElementRef<HTMLElement>;
  @ViewChild('fileInput2') fileInput2: ElementRef<HTMLElement>;
  fileToUpload: File;
  // fileToUpload1: File;
  fileToUploadList: File[] = [];
  // Status: string;
  IdentityType: string;
  IdentityValidity: boolean;
  AllIdentities: CBPIdentity[] = [];
  AllIdentityTypes: any[] = [];
  AllRoles: string[] = [];
  AllCountries: any[] = [];

  gstNumber = "";
  MSMETypes: any[] = [];
  // filteredOptions: Observable<any[]>;
  filteredOptionscountry: Observable<any[]>
  filteredOptionsregion: StateDetails[] = [];
  BPVendorOnBoarding: BPVendorOnBoarding;
  StateCode: string;

  Title: string;
  confirmvalue: any;
  index: number;
  inputvalue = '';
  emailvalue = '';
  codeselected = '';
  AllOnBoardingFieldMaster: CBPFieldMaster[] = [];
  AllGstFields: GSTFields[] = [];
  type_option: any;


  result: any;
  dialogRef: any;

  contactDetailsIndex: any;
  bankChangeIndex: number = null;
  ShowAddIdentityButton = false;
  VendorTokenCheck: VendorTokenCheck;
  initialIdentity: boolean;
  InitialBank = false;
  GSTDisable = false;
  InitialContact: boolean;
  PanEnable = false;
  ProcessRequest = false;
  AllDepartments: CBPDepartment[];
  min: Date;
  AccountGroup: string;
  tableName: MatTableDataSource<BPIdentity>;
  inputValue: any;
  maxdate: any;
  mindate: any;

  constructor(
    private _vendorRegistrationService: VendorRegistrationService,
    private _vendorMasterService: VendorMasterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute, protected dateService: NbDateService<Date>
  ) {
    this.AccountGroup = environment.AccountGroup;
    this.min = this.dateService.addMonth(this.dateService.today(), 0);
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;

    this.IdentityValidity = false;
    this.AllRoles = ['Vendor', 'Customer'];
    this.SelectedQRID = 0;
    this.answerList = new AnswerList();
    this.StateCode = '';
    this.SelectedIdentity = new BPIdentity();
    this.SelectedBank = new BPBank();
    this.AllIdentityTypes = [
      "GSTIN",
      "MSME Certificate",
      "CANCEL CHEQUE",
      "PAN",
      "Others"
    ]
    this.MSMETypes = [
      "Not Applicable",
      "Micro Enterprise",
      "Small Enterprise",
      "Medium Enterprise",
      "Legal Entity Identifier"

    ]
  }
  isDisabledDate: boolean = false;
  checked = false;
  selectedCountry: string = "";
  indeterminate = false;
  labelPosition = 'before';
  disabled = false;
  MSMERow: BPIdentity;
  attachementid: string = "";
  accountgroupvalue: string;
  // cancelchequeattcahement: boolean = false;
  authenticationDetails: AuthenticationDetails;
  currentUserName: string = "";
  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserName = this.authenticationDetails.emailAddress;
    }
    this.BPVendorOnBoarding = new BPVendorOnBoarding();
    this.SelectedBPVendorOnBoarding = new BPVendorOnBoarding();
    this.SelectedBPVendorOnBoardingView = new BPVendorOnBoardingView();
    this.MSMERow = new BPIdentity();
    this.InitializeVendorRegistrationFormGroup();
    this.GetAllOnBoardingFieldMaster();
    this.InitializeIdentificationFormGroup();
    this.InitializeBankDetailsFormGroup();
    this.InitializeContactFormGroup();
    this.initiatorFormGroup();
    this.GetAllIdentities();
    this.VendorTokenCheck = new VendorTokenCheck();
    this.route.queryParams.subscribe(params => {
      this.VendorTokenCheck.Token = params['token'];
      this.VendorTokenCheck.TransID = params['Id'];
      this.VendorTokenCheck.EmailAddress = params['Email'];
    });
    this.IsProgressBarVisibile = true;
    this.maxdate = new Date;
    this.mindate = new Date;
    this._vendorRegistrationService.CheckTokenValidity(this.VendorTokenCheck).subscribe(
      (data) => {
        if (data) {
          this._vendorRegistrationService.GetVendorOnBoardingsByID(this.VendorTokenCheck.TransID).subscribe(
            (Userdata) => {
              const Vendor = Userdata as BPVendorOnBoardingView;
              this.BPVendorOnBoarding = Vendor;
              if (this.BPVendorOnBoarding != null) {
                this.InitializeGstMandatory();
              }
              const MSMEType = Vendor.msmE_TYPE;
              if (MSMEType === "MIC") {
                this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Micro Enterprise");
              } else if (MSMEType === "SML") {
                this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Small Enterprise");
              } else if (MSMEType === "MID") {
                this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Medium Enterprise");
              }
              else {
                this.vendorRegistrationFormGroup.get('MSMEType').patchValue("Not Applicable");
              }
              this.vendorRegistrationFormGroup.get('Name').patchValue(Vendor.name);
              this.vendorRegistrationFormGroup.get('StateCode').patchValue(Vendor.stateCode);
              this.vendorRegistrationFormGroup.get('AddressLine1').patchValue(Vendor.addressLine1);
              this.vendorRegistrationFormGroup.get('AddressLine2').patchValue(Vendor.addressLine2);
              this.vendorRegistrationFormGroup.get('AddressLine3').patchValue(Vendor.addressLine3);
              this.vendorRegistrationFormGroup.get('AddressLine4').patchValue(Vendor.addressLine4);
              this.vendorRegistrationFormGroup.get('AddressLine5').patchValue(Vendor.addressLine5);
              this.vendorRegistrationFormGroup.get('pinCode').patchValue(Vendor.pinCode);
              this.vendorRegistrationFormGroup.get('city').patchValue(Vendor.city);
              this.vendorRegistrationFormGroup.get('primaryContact').patchValue(Vendor.primaryContact);
              this.vendorRegistrationFormGroup.get('secondaryContact').patchValue(Vendor.secondaryContact);
              this.vendorRegistrationFormGroup.get('primarymail').patchValue(Vendor.primarymail);
              this.vendorRegistrationFormGroup.get('secondarymail').patchValue(Vendor.secondarymail);
              this.vendorRegistrationFormGroup.get('gstNumber').patchValue(Vendor.gstNumber);
              this.vendorRegistrationFormGroup.get('certificateNo').patchValue(Vendor.certificateNo);
              this.vendorRegistrationFormGroup.get('validFrom').patchValue(Vendor.validFrom);
              this.vendorRegistrationFormGroup.get('validTo').patchValue(Vendor.validTo);
              this.InitiatorFormGroup.get('AccountGroup').patchValue(Vendor.accountGroup);
              this.InitiatorFormGroup.get('CompanyCode').patchValue(Vendor.purchaseOrg);
              this.InitiatorFormGroup.get('PurchaseOrg').patchValue(Vendor.companyCode);
              this.InitiatorFormGroup.get('Gst').patchValue(Vendor.gstValue);
              this.InitiatorFormGroup.get('Name').patchValue(Vendor.name);
              this.InitiatorFormGroup.get('Mail').patchValue(Vendor.primarymail);

              this.accountgroupvalue = Vendor.accountGroup.substring(0, 4);
              const accountgrpsplit = this.AccountGroup.split(',');
              var accountGrpindex = accountgrpsplit.indexOf(this.accountgroupvalue);
              //this.cancelchequeattcahement = accountGrpindex == -1 ? false : true;


              this.IsProgressBarVisibile = true;
              this._vendorRegistrationService.GetBanksByVOB(this.VendorTokenCheck.TransID).subscribe(
                (bank) => {
                  this.IsProgressBarVisibile = false;
                  let b = bank as BPBank[];
                  if (b.length >= 1) {
                    this.BanksByVOB = bank as BPBank[];
                    console.log('this.BanksByVOB :', this.BanksByVOB)
                    this.InitialBank = false;
                    this.bankDetailsDataSource = new MatTableDataSource<BPBank>(this.BanksByVOB);
                  }
                }
              );
              this.IdentificationsByVOB = [];
              this.IsProgressBarVisibile = true;
              this._vendorRegistrationService.GetIdentificationsByVOB(this.VendorTokenCheck.TransID).subscribe(
                (identity) => {
                  this.IsProgressBarVisibile = false;
                  let iden = identity;
                  console.log('BPIdentity', iden);
                  if (iden.length >= 1) {
                    this.IdentificationsByVOB = identity as BPIdentity[];
                    console.log("this.IdentificationsByVOB : ",)
                    this.GetAllIdentityTypes();

                    this.identificationDataSource = new MatTableDataSource<BPIdentity>(this.IdentificationsByVOB);
                  }
                  else {

                  }
                }
              );
            }
          );
          this.IsProgressBarVisibile = false;
        }
        else {
          this.vendorRegistrationFormGroup.disable();
          this.identificationFormGroup.disable();
          this.bankDetailsFormGroup.disable();
          this.contactFormGroup.disable();
          this.openSnackBar('Token might have already used or wrong token', SnackBarStatus.danger, 6000);
          this.IsProgressBarVisibile = false;
        }
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        console.log('Err', err);
        this.vendorRegistrationFormGroup.disable();
        this.identificationFormGroup.disable();
        this.bankDetailsFormGroup.disable();
        this.contactFormGroup.disable();
        this.openSnackBar('Token might have already used or wrong token', SnackBarStatus.danger, 6000);
      }
    );
    this.GetAllCompanyandAccount();
  }
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.identificationDataSource.data.forEach(element => {
      this.selection.select(element);
    });

  }
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.identificationDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle1(): void {
    if (this.isAllSelected1()) {
      this.selection1.clear();
      return;
    }
    this.bankDetailsDataSource.data.forEach(element => {
      this.selection1.select(element);
    });
  }
  isAllSelected1(): boolean {
    const numSelected = this.selection1.selected.length;
    const numRows = this.bankDetailsDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle2(): void {
    if (this.isAllSelected2()) {
      this.selection2.clear();
      return;
    }
    this.contactDataSource.data.forEach(element => {
      this.selection2.select(element);
    });
  }
  isAllSelected2(): boolean {
    const numSelected = this.selection2.selected.length;
    const numRows = this.contactDataSource.data.length;
    return numSelected === numRows;
  }
  GetAllCompanyandAccount(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.GetAllCompanyAndAccount().subscribe(
      (data) => {
        this.data = data;
        if (this.data.country_code.length && this.data.country_code.length != 0) {
          this.CountryDetails = [];
          for (let i = 0; i < this.data.country_code.length; i++) {


            const newCountryDetail: CountryDetails = new CountryDetails();
            newCountryDetail.CountryCode = this.data.country_code[i];
            newCountryDetail.Country = this.data.country_desc[i];
            this.CountryData.push(`${this.data.country_code[i]}`)
            this.CountryDetail.push(newCountryDetail);
            this.CountryDetails.push(newCountryDetail);
            this.pincodelength.push(`${this.data.country_code_length[i]}`)
          }

        }
        if (this.data.region_code.length && this.data.country_code.length != 0) {
          for (let i = 0; i < this.data.region_code.length; i++) {
            this.regionCountry.push(`${this.data.region_country[i]}`);
          }
        }

      });
  }
  panValidate(): void {
    if (this.vendorRegistrationFormGroup.get('gstNumber').valid) {
      if (this.vendorRegistrationFormGroup.get('PAN').valid) {
        if (this.vendorRegistrationFormGroup.get('gstNumber').value != null) {
          let gst = this.vendorRegistrationFormGroup.get('gstNumber').value;
          let pan = this.vendorRegistrationFormGroup.get('PAN').value;
          this.pangstvalidate = gst.includes(pan);
          if (!this.pangstvalidate) {
            this.notificationSnackBarComponent.openSnackBar("Check PAN and GST number", SnackBarStatus.danger, 2000)
          }
        }
        else {
          this.pangstvalidate = true;
        }

      }
    }

  }
  changeOptions(): void {
    if (this.vendorRegistrationFormGroup.get('MSMEType').value != 'Not Applicable') {
      this.MSMEAttachement = true;
      this.vendorRegistrationFormGroup.get('certificateNo').setValidators([Validators.required, Validators.maxLength(30)]);
      this.vendorRegistrationFormGroup.get('validFrom').setValidators([Validators.required]);
      this.vendorRegistrationFormGroup.get('validTo').setValidators([Validators.required]);
      this.vendorRegistrationFormGroup.get('RegisterCity').setValidators([Validators.required, , Validators.maxLength(25)]);
      this.vendorRegistrationFormGroup.get('certificateNo').updateValueAndValidity();
      this.vendorRegistrationFormGroup.get('validFrom').updateValueAndValidity();
      this.vendorRegistrationFormGroup.get('validTo').updateValueAndValidity();
      this.vendorRegistrationFormGroup.get('RegisterCity').updateValueAndValidity();
    }
    else {
      this.MSMEAttachement = false;
      this.vendorRegistrationFormGroup.get('certificateNo').setValidators([]);
      this.vendorRegistrationFormGroup.get('validFrom').setValidators([]);
      this.vendorRegistrationFormGroup.get('validTo').setValidators([]);
      this.vendorRegistrationFormGroup.get('RegisterCity').setValidators([]);
      this.vendorRegistrationFormGroup.get('certificateNo').updateValueAndValidity();
      this.vendorRegistrationFormGroup.get('validFrom').updateValueAndValidity();
      this.vendorRegistrationFormGroup.get('validTo').updateValueAndValidity();
      this.vendorRegistrationFormGroup.get('RegisterCity').updateValueAndValidity();
    }

  }
  findAllIndices(value: string): number[] {
    return this.regionCountry.map((item, index) => item === value ? index : -1)
      .filter(index => index !== -1);
  }
  RegionOptions($event): void {
    if (this.vendorRegistrationFormGroup.get('StateCode').value != null) {
      console.log("event", $event.value)
      this.filteredOptionsregion = this.regionData.filter((d) => {

        console.log("d", d)
      });
    }
  }
  CountryOptions($event): void {

    if (this.vendorRegistrationFormGroup.get('country').value != null) {
      this.vendorRegistrationFormGroup.get('StateCode').reset();

      var countryvalue = $event;
      this.regionDatas = [];
      const indicesOfBanana = this.findAllIndices(countryvalue);
      console.log("indicesOfBanana", indicesOfBanana)
      console.log(indicesOfBanana);
      if (indicesOfBanana.length && indicesOfBanana.length != 0) {
        indicesOfBanana.forEach((index) => {
          const newStateDetail: StateDetails = new StateDetails();
          newStateDetail.StateCode = this.data.region_code[index];
          newStateDetail.State = this.data.region_desc[index]
          this.regionData.push(newStateDetail);
          this.regionDatas.push(newStateDetail);

        })
      }
      this.PincodeLenght(countryvalue);
    }
  }

  PincodeLenght(countryvalue: string): void {
    var codeindex = this.CountryData.indexOf(countryvalue);
    if (codeindex != -1) {
      this.lengthOfPincode = parseInt(this.pincodelength[codeindex]);
      console.log(this.lengthOfPincode);
      if (this.lengthOfPincode != 0) {
        Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {

          if (key == 'pinCode') {
            this.vendorRegistrationFormGroup.get('pinCode').enable();
            this.vendorRegistrationFormGroup.get(key).setValidators([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(this.lengthOfPincode), Validators.maxLength(this.lengthOfPincode)]);
            this.vendorRegistrationFormGroup.get(key).updateValueAndValidity();
          }

        });
      }
      else {
        Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {

          if (key == 'pinCode') {
            this.vendorRegistrationFormGroup.get('pinCode').disable();
            this.vendorRegistrationFormGroup.get(key).setValidators([]);
            this.vendorRegistrationFormGroup.get(key).updateValueAndValidity();
          }

        });
      }

    }
  }
  changeAttachmentOptions(): void {
    if (this.identificationFormGroup.get('Type').value != null) {
      this.attachementid = this.identificationFormGroup.get('Type').value;
      if (this.attachementid == "GSTIN") {
        this.identificationFormGroup.get('IDNumber').reset();

        if (this.vendorRegistrationFormGroup.get('gstNumber').value != null) {
          this.identificationFormGroup.get('IDNumber').patchValue(this.vendorRegistrationFormGroup.get('gstNumber').value);
        }


      }
      else if (this.attachementid == "PAN") {
        this.identificationFormGroup.get('IDNumber').reset();

        if (this.vendorRegistrationFormGroup.get('PAN').value != null) {
          this.identificationFormGroup.get('IDNumber').patchValue(this.vendorRegistrationFormGroup.get('PAN').value);
        }
      }
      else if (this.attachementid == "MSME Certificate") {
        this.identificationFormGroup.get('IDNumber').reset();
        if (this.vendorRegistrationFormGroup.get('certificateNo').value != null) {
          this.identificationFormGroup.get('IDNumber').patchValue(this.vendorRegistrationFormGroup.get('certificateNo').value);
        }
      }

      else {
        this.identificationFormGroup.get('IDNumber').setValidators([]);
        this.identificationFormGroup.get('IDNumber').updateValueAndValidity();
      }
    }
  }
  initiatorFormGroup(): void {
    this.InitiatorFormGroup = this._formBuilder.group({
      AccountGroup: [''],
      CompanyCode: [''],
      PurchaseOrg: [''],
      Gst: [''],
      Name: [''],
      Mail: ['']
    })
  }
  InitializeVendorRegistrationFormGroup(): void {
    this.vendorRegistrationFormGroup = this._formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(35)]],
      PAN: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]],
      gstNumber: [''],
      MSMEType: ['Not Applicable', Validators.required],
      AddressLine1: ['', Validators.maxLength(40)],
      AddressLine2: ['', Validators.maxLength(40)],
      AddressLine3: ['', Validators.maxLength(60)],
      AddressLine4: ['', Validators.maxLength(40)],
      AddressLine5: ['', Validators.maxLength(40)],
      certificateNo: [''],
      validFrom: [''],
      validTo: [''],
      RegisterCity: [''],
      city: ['', Validators.required],
      country: ['', [Validators.required]],
      pinCode: [''],
      StateCode: ['', Validators.required],
      primaryContact: ['', [Validators.required, Validators.pattern("^[0-9]{9,16}$")]],
      secondaryContact: ['', [Validators.pattern("^[0-9]{9,16}$")]],
      primarymail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.maxLength(60)]],
      secondarymail: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.maxLength(60)]],
    });
  }
  InitializeBankDetailsFormGroup(): void {
    this.bankDetailsFormGroup = this._formBuilder.group({
      AccountNo: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      IFSC: ['', [Validators.required]],
      BankName: ['', Validators.required, , Validators.maxLength(60)],
      Branch: ['', Validators.required, , Validators.maxLength(40)],
      City: ['', Validators.required, , Validators.maxLength(35)],
    });
  }
  InitializeIdentificationFormGroup(): void {
    this.identificationFormGroup = this._formBuilder.group({
      Type: ['', Validators.required],
      Option: [''],
      IDNumber: [''],
      ValidUntil: [''],
    });
    this.InitializeIdentificationTable();
    this.identificationFormGroup.get('Option').disable();
  }

  InitializeIdentificationTable(): void {
    const bPIdentity = new BPIdentity();
    this.initialIdentity = true;
    this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
  }


  InitializeContactFormGroup(): void {
    this.contactFormGroup = this._formBuilder.group({
      Name: [''],
      department: [''],
      Title: [''],
      Mobile: [''],
      Email: [''],
    });

  }


  ResetControl(): void {
    this.SelectedBPVendorOnBoarding = new BPVendorOnBoarding();
    this.SelectedBPVendorOnBoardingView = new BPVendorOnBoardingView();
    this.selectID = 0;
    this.fileToUpload = null;
    // this.fileToUpload1 = null;
    this.fileToUploadList = [];
    this.ResetVendorRegistrationFormGroup();
    this.ClearIdentificationFormGroup();
    this.ClearBankDetailsFormGroup();
    this.ClearContactFormGroup();
    this.ClearIdentificationDataSource();
    this.ClearBankDetailsDataSource();

  }
  ResetVendorRegistrationFormGroup(): void {
    this.vendorRegistrationFormGroup.reset();
    Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {
      this.vendorRegistrationFormGroup.get(key).enable();
      this.vendorRegistrationFormGroup.get(key).markAsUntouched();
    });
  }

  ClearIdentificationFormGroup(): void {
    this.identificationFormGroup.reset();
    Object.keys(this.identificationFormGroup.controls).forEach(key => {
      this.identificationFormGroup.get(key).markAsUntouched();
    });
  }


  ClearBankDetailsFormGroup(): void {
    this.bankDetailsFormGroup.reset();
    Object.keys(this.bankDetailsFormGroup.controls).forEach(key => {
      this.bankDetailsFormGroup.get(key).markAsUntouched();
    });
  }

  ClearContactFormGroup(): void {
    this.contactFormGroup.reset();
    Object.keys(this.contactFormGroup.controls).forEach(key => {
      this.contactFormGroup.get(key).markAsUntouched();
    });
  }
  ClearVendorRegistrationFormGroup(): void {
    this.vendorRegistrationFormGroup.reset();
    Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {
      this.vendorRegistrationFormGroup.get(key).markAsUntouched();
    });
  }
  ClearInitiatorFormGroup(): void {
    this.InitiatorFormGroup.reset();
    Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {
      this.vendorRegistrationFormGroup.get(key).markAsUntouched();
    });
  }


  ClearIdentificationDataSource(): void {
    this.IdentificationsByVOB = [];
    this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
  }

  ClearBankDetailsDataSource(): void {
    this.BanksByVOB = [];
    this.bankDetailsDataSource = new MatTableDataSource(this.BanksByVOB);
  }







  GetAllIdentities(): void {
    this._vendorMasterService.GetAllIdentities().subscribe(
      (data) => {
        this.AllIdentities = data as CBPIdentity[];
        console.log('this.AllIdentities :', this.AllIdentities)
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetAllIdentityTypes(): void {
    this.IsProgressBarVisibile = true;
    this._vendorMasterService.GetAllIdentityFields().subscribe(
      (data) => {
        if (data != null) {
          this.IsProgressBarVisibile = false;
          this.CBPIdentity = data as CBPIdentityFieldMaster[];
          var identity = data as BPIdentity[]


        }
        (err) => {
          this.notificationSnackBarComponent.openSnackBar(err, SnackBarStatus.success, 2000);
        }

      }
    );
  }

  formIdentity(ele): BPIdentity {

    let iden = new BPIdentity;
    iden.docType = ele
    console.log("doctype", ele)
    return iden
  }


  keytab(elementName): void {
    switch (elementName) {
      case 'iDNumber': {
        this.iDNumber.nativeElement.focus();
        break;
      }
      case 'validUntil': {
        this.validUntil.nativeElement.focus();
        break;
      }
      case 'accountNo': {
        this.accountNo.nativeElement.focus();
        break;
      }
      case 'ifsc': {
        this.ifsc.nativeElement.focus();
        break;
      }
      case 'bankName': {
        this.bankName.nativeElement.focus();
        break;
      }
      case 'branch': {
        this.branch.nativeElement.focus();
        break;
      }
      case 'bankCity': {
        this.bankCity.nativeElement.focus();
        break;
      }
      default: {
        break;
      }
    }
  }



  SetBPVendorOnBoardingValues(): void {
    this.vendorRegistrationFormGroup.get('Name').patchValue(this.SelectedBPVendorOnBoarding.name);
    this.vendorRegistrationFormGroup.get('StateCode').patchValue(this.SelectedBPVendorOnBoarding.stateCode);
    this.vendorRegistrationFormGroup.get('AddressLine1').patchValue(this.SelectedBPVendorOnBoarding.addressLine1);
    this.vendorRegistrationFormGroup.get('AddressLine2').patchValue(this.SelectedBPVendorOnBoarding.addressLine2);
    this.vendorRegistrationFormGroup.get('AddressLine3').patchValue(this.SelectedBPVendorOnBoarding.addressLine3);
    this.vendorRegistrationFormGroup.get('AddressLine4').patchValue(this.SelectedBPVendorOnBoarding.addressLine4);
    this.vendorRegistrationFormGroup.get('AddressLine5').patchValue(this.SelectedBPVendorOnBoarding.addressLine5);
    this.vendorRegistrationFormGroup.get('city').patchValue(this.SelectedBPVendorOnBoarding.city);
    this.vendorRegistrationFormGroup.get('country').patchValue(this.SelectedBPVendorOnBoarding.country);
    this.vendorRegistrationFormGroup.get('primaryContact').patchValue(this.SelectedBPVendorOnBoarding.primaryContact);
    this.vendorRegistrationFormGroup.get('secondaryContact').patchValue(this.SelectedBPVendorOnBoarding.secondaryContact);
    this.vendorRegistrationFormGroup.get('primarymail').patchValue(this.SelectedBPVendorOnBoarding.primarymail);
    this.vendorRegistrationFormGroup.get('secondarymail').patchValue(this.SelectedBPVendorOnBoarding.secondarymail);

    this.vendorRegistrationFormGroup.get('certificateNo').patchValue(this.SelectedBPVendorOnBoarding.certificateNo);
    this.vendorRegistrationFormGroup.get('validFrom').patchValue(this.SelectedBPVendorOnBoarding.validFrom);
    this.vendorRegistrationFormGroup.get('validTo').patchValue(this.SelectedBPVendorOnBoarding.validTo);
    this.vendorRegistrationFormGroup.get('RegisterCity').patchValue(this.SelectedBPVendorOnBoarding.registeredCity);
  }

  GetBPVendorOnBoardingSubItems(): void {
    this.GetIdentificationsByVOB();
    this.GetBanksByVOB();
  }

  GetIdentificationsByVOB(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.GetIdentificationsByVOB(this.SelectedBPVendorOnBoarding.transID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.IdentificationsByVOB = data as BPIdentity[];
        this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
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
        this.IsProgressBarVisibile = false;
      }
    );
  }



  IdentityTypeSelected(): void {
    const selectedType = this.identificationFormGroup.get('Type').value as string;
    if (this.identificationFormGroup.get('Type').value === "GST" || this.identificationFormGroup.get('Type').value === "PAN") {
      this.identificationFormGroup.get('IDNumber').disable();
    }

  }

  AddIdentificationToTable(): void {
    if (this.identificationFormGroup.valid) {
      if (this.fileToUpload) {
        const bPIdentity = new BPIdentity();
        bPIdentity.docType = this.identificationFormGroup.get('Type').value;
        bPIdentity.idNumber = this.identificationFormGroup.get('IDNumber').value;
        if (!this.IdentificationsByVOB || !this.IdentificationsByVOB.length || !this.IdentificationsByVOB[0].docType) {
          this.IdentificationsByVOB = [];
        }
        const dup = this.IdentificationsByVOB.filter(x => x.docType === bPIdentity.docType && x.idNumber === bPIdentity.idNumber)[0];
        if (!dup) {
          if (bPIdentity.docType && bPIdentity.docType.toLowerCase().includes('gst')) {
            const id = this.identificationFormGroup.get('IDNumber').value;
            const state_id = id.substring(0, 2);
            const pan_id = id.substring(2, 12);
            if (state_id === this.StateCode) {
              if (this.fileToUpload) {
                bPIdentity.attachmentName = this.fileToUpload.name;
                this.fileToUploadList.push(this.fileToUpload);
                this.fileToUpload = null;
              }
              if (!this.IdentificationsByVOB || !this.IdentificationsByVOB.length || !this.IdentificationsByVOB[0].docType) {
                this.IdentificationsByVOB = [];
              }
              this.IdentificationsByVOB.push(bPIdentity);
              const bPIdentity_PAN = new BPIdentity();
              bPIdentity_PAN.docType = 'PAN CARD';
              bPIdentity_PAN.idNumber = pan_id;
              if (this.fileToUpload) {
                bPIdentity.attachmentName = this.fileToUpload.name;
                this.fileToUploadList.push(this.fileToUpload);
                this.fileToUpload = null;
              }
              this.IdentificationsByVOB.push(bPIdentity_PAN);
              this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
              this.ClearIdentificationFormGroup();
            } else {

            }

          } else {
            if (this.fileToUpload) {
              bPIdentity.attachmentName = this.fileToUpload.name;
              this.fileToUploadList.push(this.fileToUpload);
              this.fileToUpload = null;
            }
            if (!this.IdentificationsByVOB || !this.IdentificationsByVOB.length || !this.IdentificationsByVOB[0].docType) {
              this.IdentificationsByVOB = [];
            }
            this.IdentificationsByVOB.push(bPIdentity);
            this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
            this.ClearIdentificationFormGroup();
          }
        }
        else {
          this.notificationSnackBarComponent.openSnackBar(`Duplicate record`, SnackBarStatus.danger, 5000);
        }
      } else {
        this.notificationSnackBarComponent.openSnackBar(`Please select an attachment`, SnackBarStatus.danger, 5000);
      }
    } else {
      this.ShowValidationErrors(this.identificationFormGroup);
    }
  }

  // AddBankToTable(): void {
  //   if (this.bankDetailsFormGroup.valid) {
  //     if (this.fileToUpload1) {
  //       const bPBank = new BPBank();
  //       bPBank.accountNo = this.bankDetailsFormGroup.get('AccountNo').value;

  //       bPBank.ifsc = this.bankDetailsFormGroup.get('IFSC').value;
  //       bPBank.bankName = this.bankDetailsFormGroup.get('BankName').value;
  //       bPBank.branch = this.bankDetailsFormGroup.get('Branch').value;
  //       bPBank.city = this.bankDetailsFormGroup.get('City').value;
  //       if (!this.BanksByVOB || !this.BanksByVOB.length || !this.BanksByVOB[0].accountNo) {
  //         this.BanksByVOB = [];
  //       }
  //       const dupli = this.BanksByVOB.filter(x => x.accountNo === bPBank.accountNo)[0];
  //       if (!dupli) {
  //         this.BanksByVOB.push(bPBank);
  //         this.bankDetailsDataSource = new MatTableDataSource(this.BanksByVOB);
  //         this.ClearBankDetailsFormGroup();
  //       }
  //       else {
  //         this.notificationSnackBarComponent.openSnackBar(`Duplicate record`, SnackBarStatus.danger, 5000);
  //       }
  //     } else {
  //       this.notificationSnackBarComponent.openSnackBar(`Please select an attachment`, SnackBarStatus.danger, 5000);
  //     }
  //   } else {
  //     this.ShowValidationErrors(this.bankDetailsFormGroup);
  //   }
  // }

  SelectIdentityRow(row: any): void {
    if (this.ProcessRequest) {
      this.openSnackBar("Please Wait Request In Progress", SnackBarStatus.danger);
    }
    else {
      this.IdentityRowSelectedIndex = this.IdentificationsByVOB.indexOf(row);
      this.identificationFormGroup.get('IDNumber').enable();
      console.log("SelectIdentityRow", row)
      this.identificationFormGroup.get('Type').patchValue(row.docType);
      this.identificationFormGroup.get('IDNumber').patchValue(row.idNumber);
      this.ShowAddIdentityButton = true;
      this.SelectedIdentity = row;
    }
  }
  AddIdentificationToTableDataSource(): void {


    //New Code
    console.log('this.identificationFormGroup.valid', this.identificationFormGroup.valid);
    if (this.identificationFormGroup.valid) {
      console.log('this.fileToUpload', this.fileToUpload);
      if (this.fileToUpload) {
        console.log('this.IdentityRowSelectedIndex', this.IdentityRowSelectedIndex);
        if (this.IdentityRowSelectedIndex !== null) {

          const filesize = Math.round((this.fileToUpload.size / 1000));

          const gbSize = filesize / (1024 * 1024);
          const IdentityFieldIndex = this.CBPIdentity.findIndex(x => x.text === this.identificationDataSource.data[this.IdentityRowSelectedIndex].docType);
          if (filesize <= this.CBPIdentity[IdentityFieldIndex].maxSizeInKB) {
            this.IsProgressBarVisibile = true;
            this.ProcessRequest = true;
            var fileuploaddate = new Date();
            this._vendorRegistrationService.AddUserAttachment(fileuploaddate, this.identificationDataSource.data[this.IdentityRowSelectedIndex].idNumber, filesize, this.VendorTokenCheck.TransID, this.VendorTokenCheck.EmailAddress, this.fileToUpload, this.fileToUpload.name, this.identificationDataSource.data[this.IdentityRowSelectedIndex].docType).subscribe(
              (data) => {
                console.log(data);
                if (data !== null) {
                  this.identificationDataSource.data[this.IdentityRowSelectedIndex].docType = this.identificationFormGroup.get('Type').value;
                  this.identificationDataSource.data[this.IdentityRowSelectedIndex].idNumber = this.identificationFormGroup.get('IDNumber').value;
                  this.identificationDataSource.data[this.IdentityRowSelectedIndex].size = filesize.toString();
                  this.identificationDataSource.data[this.IdentityRowSelectedIndex].date = data.date;
                  this.identificationDataSource.data[this.IdentityRowSelectedIndex].attachmentName = this.fileToUpload.name;

                  if (this.fileToUpload) {
                    const index = this.fileToUploadList.findIndex(x => x.name === this.fileToUpload.name);
                    if (index >= 0) {
                      this.fileToUploadList.splice(index, 1);
                    }
                    this.fileToUploadList.push(this.fileToUpload);

                  }
                  this.ClearIdentificationFormGroup();
                  this.IdentityRowSelectedIndex = null;
                  this.fileToUpload = null;
                  this.identificationFormGroup.get('IDNumber').enable();
                  this.IsProgressBarVisibile = false;
                  this.ProcessRequest = false;

                }
                else {
                  this.IsProgressBarVisibile = false;
                  this.ProcessRequest = false;
                  this.openSnackBar('Duplicate attachment found', SnackBarStatus.danger);
                }
              },
              (err) => {
                this.IsProgressBarVisibile = false;
                this.ProcessRequest = false;
                console.log("Error", err);
              }
            );
          }
          else {
            let error = "File Size Should be less than 3 MB";
            this.openSnackBar(error, SnackBarStatus.danger)
          }
        }
        else {

          let index = this.identificationDataSource.data.findIndex(x => x.docType == this.identificationFormGroup.get('Type').value);
          const filesize = Math.round((this.fileToUpload.size / 1000));
          const gbSize = filesize / (1024 * 1024);
          const IdentityFieldIndex = this.CBPIdentity.findIndex(x => x.text === this.identificationFormGroup.get('Type').value);
          console.log('his.CBPIdentity', this.CBPIdentity);
          console.log('IdentityFieldIndex', IdentityFieldIndex)
          if (filesize <= this.CBPIdentity[IdentityFieldIndex].maxSizeInKB) {
            this.IsProgressBarVisibile = true;
            var fileuploaddate = new Date();
            this._vendorRegistrationService.AddUserAttachment(fileuploaddate, this.identificationFormGroup.get('IDNumber').value, filesize, this.VendorTokenCheck.TransID, this.VendorTokenCheck.EmailAddress, this.fileToUpload, this.fileToUpload.name, this.identificationDataSource.data[index].docType).subscribe(
              (data) => {
                if (data !== null) {
                  this.identificationDataSource.data[index].docType = this.identificationFormGroup.get('Type').value;
                  this.identificationDataSource.data[index].idNumber = this.identificationFormGroup.get('IDNumber').value;
                  this.identificationDataSource.data[index].attachmentName = this.fileToUpload.name;
                  this.identificationDataSource.data[index].size = filesize.toString();
                  this.identificationDataSource.data[index].date = data.date;
                  if (this.fileToUploadList) {
                    const index = this.fileToUploadList.findIndex(x => x.name === this.fileToUpload.name);
                    if (index >= 0) {
                      this.fileToUploadList.splice(index, 1);
                    }
                    this.fileToUploadList.push(this.fileToUpload);
                    this.fileToUpload = null;
                  }
                  this.ClearIdentificationFormGroup();
                  this.fileToUpload = null;
                  // this.ShowAddIdentityButton=false
                  this.identificationFormGroup.get('IDNumber').enable();
                  this.IsProgressBarVisibile = false;

                }
                else {
                  this.IsProgressBarVisibile = false;

                  this.openSnackBar('Duplicate attachment found', SnackBarStatus.danger);
                }
              });
          }
          else {
            this.IsProgressBarVisibile = false;

            let error = "File Size Should be less than 3 MB";
            this.openSnackBar(error, SnackBarStatus.danger)
          }
        }
      }
      else {
        if (this.identificationFormGroup.get('Type').value !== "Others" && this.GSTAttachment) {
          this.openSnackBar('Please Add Attachment', SnackBarStatus.danger);
        }
        else {
          let index = this.identificationDataSource.data.findIndex(x => x.docType == this.identificationFormGroup.get('Type').value);
          const filesize = Math.round((this.fileToUpload.size / 1000));
          const gbSize = filesize / (1024 * 1024);
          const IdentityFieldIndex = this.CBPIdentity.findIndex(x => x.text === this.identificationFormGroup.get('Type').value);
          var fileuploaddate = new Date();
          if (filesize <= this.CBPIdentity[IdentityFieldIndex].maxSizeInKB) {
            this._vendorRegistrationService.AddUserAttachment(fileuploaddate, this.identificationFormGroup.get('IDNumber').value, filesize, this.VendorTokenCheck.TransID, this.VendorTokenCheck.EmailAddress, this.fileToUpload, this.fileToUpload.name, this.identificationDataSource.data[index].docType).subscribe(
              (data) => {
                if (data !== null) {
                  this.identificationDataSource.data[index].docType = this.identificationFormGroup.get('Type').value;
                  this.identificationDataSource.data[index].idNumber = this.identificationFormGroup.get('IDNumber').value;
                  this.identificationDataSource.data[index].attachmentName = this.fileToUpload.name;
                  this.identificationDataSource.data[index].size = filesize.toString();
                  this.identificationDataSource.data[index].date = data.date;
                  if (this.fileToUploadList) {
                    const index = this.fileToUploadList.findIndex(x => x.name === this.fileToUpload.name);
                    if (index >= 0) {
                      this.fileToUploadList.splice(index, 1);
                    }
                    this.fileToUploadList.push(this.fileToUpload);
                    this.fileToUpload = null;
                  }
                  this.ClearIdentificationFormGroup();
                  this.fileToUpload = null;
                  this.identificationFormGroup.get('IDNumber').enable();
                  this.IsProgressBarVisibile = false;

                }
                else {
                  this.IsProgressBarVisibile = false;

                  this.openSnackBar('Duplicate attachment found', SnackBarStatus.danger);
                }
              });
          }
          else {
            this.IsProgressBarVisibile = false;

            let error = "File Size Should be less than 3 MB";
            this.openSnackBar(error, SnackBarStatus.danger)
          }
        }
      }
    }
    else {
      this.ShowValidationErrors(this.identificationFormGroup);
    }
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
  AddBankToTableDataSource(event): void {
    console.log('Bank Data', event);
    if (this.bankDetailsFormGroup.valid) {

      if (this.InitialBank) {
        this.BanksByVOB = [];
        this.bankDetailsDataSource = new MatTableDataSource<BPBank>(this.BanksByVOB);
        this.InitialBank = false;
        console.log('this.InitialBank = false', this.InitialBank);
      }
      const bPBank = new BPBank();
      bPBank.accountNo = this.bankDetailsFormGroup.get('AccountNo').value;
      bPBank.ifsc = this.bankDetailsFormGroup.get('IFSC').value;
      bPBank.bankName = this.bankDetailsFormGroup.get('BankName').value;
      bPBank.branch = this.bankDetailsFormGroup.get('Branch').value;
      bPBank.city = this.bankDetailsFormGroup.get('City').value;
      bPBank.transID = this.VendorTokenCheck.TransID;
      const dupli = this.BanksByVOB.findIndex(x => x.accountNo === bPBank.accountNo);
      console.log('dupli', dupli, this.BanksByVOB);
      if (dupli === -1) {

        this._vendorRegistrationService.CreateBank(bPBank).subscribe(
          (data) => {
            if (data) {
              this.BanksByVOB.push(bPBank);
              console.log(this.BanksByVOB);
              this.bankDetailsDataSource = new MatTableDataSource<BPBank>(this.BanksByVOB);
            }
          });
        this.ClearBankDetailsFormGroup();
      }
      else if (dupli != -1 && this.bankChangeIndex != null) {
        const bPBank = new BPBank();
        this.BanksByVOB[this.bankChangeIndex].transID = this.VendorTokenCheck.TransID;
        this.BanksByVOB[this.bankChangeIndex].accountNo = this.bankDetailsFormGroup.get('AccountNo').value;
        this.BanksByVOB[this.bankChangeIndex].ifsc = this.bankDetailsFormGroup.get('IFSC').value;
        this.BanksByVOB[this.bankChangeIndex].bankName = this.bankDetailsFormGroup.get('BankName').value;
        this.BanksByVOB[this.bankChangeIndex].branch = this.bankDetailsFormGroup.get('Branch').value;
        this.BanksByVOB[this.bankChangeIndex].city = this.bankDetailsFormGroup.get('City').value;
        this._vendorRegistrationService.UpdateBank(this.BanksByVOB[this.bankChangeIndex]).subscribe(
          (data) => {
            console.log(data);
          }
        )
        this.bankDetailsDataSource = new MatTableDataSource<BPBank>(this.BanksByVOB);
        this.bankChangeIndex = null;
      }
      else {
        this.notificationSnackBarComponent.openSnackBar(`Duplicate record, Account Number Should be Unique`, SnackBarStatus.danger, 5000);
      }



      this.ClearBankDetailsFormGroup();


    }
    else {
      this.ShowValidationErrors(this.bankDetailsFormGroup);
    }
  }
  BankRowClicked(BankDetails: any): void {
    this.ClearBankDetailsFormGroup();
    this.bankChangeIndex = this.BanksByVOB.indexOf(BankDetails);
    console.log('Row:', BankDetails);
    this.bankDetailsFormGroup.get('AccountNo').patchValue(BankDetails.accountNo);
    this.bankDetailsFormGroup.get('IFSC').patchValue(BankDetails.ifsc);
    this.bankDetailsFormGroup.get('BankName').patchValue(BankDetails.bankName);
    this.bankDetailsFormGroup.get('Branch').patchValue(BankDetails.branch);
    this.bankDetailsFormGroup.get('City').patchValue(BankDetails.city);

  }

  removeidentity(): void {
    if (this.index > -1) {
      this.fileToUploadList.splice(this.index, 1);

      if (this.index != -1) {
        this.IdentificationsByVOB[this.index].attachmentName = null;
        this.IdentificationsByVOB[this.index].date = null;
        this.IdentificationsByVOB[this.index].idNumber = "";
        this.IdentificationsByVOB[this.index].size = "";
      }
      this._vendorRegistrationService.DeleteIdentityofVOB(this.VendorTokenCheck.TransID, this.IdentificationsByVOB[this.index].docType).subscribe(
        (data) => {

        }
      )
      this.identificationDataSource = new MatTableDataSource(this.IdentificationsByVOB);
      if (!this.IdentificationsByVOB || !this.IdentificationsByVOB.length) {
        this.InitializeIdentificationTable();
      }
    }
  }
  removeidentityFromTable(IdentificationsByVOB: BPIdentity): void {
    this.index = this.IdentificationsByVOB.indexOf(IdentificationsByVOB);
    const Actiontype = 'delete document';
    const Catagory = 'Row';
    this.OpenConfirmationDialog(Actiontype, Catagory);
  }
  RemoveBankFromTable(bPBank: BPBank): void {
    this.index = this.BanksByVOB.indexOf(bPBank);
    const Actiontype = 'delete';
    const Catagory = 'Row';
    this.OpenConfirmationDialog(Actiontype, Catagory);
    this.bankDetailsDataSource = new MatTableDataSource(this.BanksByVOB);
  }
  removebank(): void {
    if (this.index > -1) {
      let deleteindex = this.index
      const bPBank = new BPBank();
      bPBank.transID = this.BanksByVOB[this.index].transID;
      bPBank.ifsc = this.BanksByVOB[this.index].ifsc;
      bPBank.accountNo = this.BanksByVOB[this.index].accountNo;
      bPBank.city = this.BanksByVOB[this.index].city;
      bPBank.branch = this.BanksByVOB[this.index].branch;
      bPBank.bankName = this.BanksByVOB[this.index].bankName;
      this._vendorRegistrationService.DeleteBank(bPBank).subscribe(
        (data) => {
          this.BanksByVOB.splice(deleteindex, 1);
          this.bankDetailsDataSource = new MatTableDataSource(this.BanksByVOB);
        },
        (err) => {
          this.notificationSnackBarComponent.openSnackBar(err, SnackBarStatus.success, 2000);
        }
      );
      if (!this.BanksByVOB || !this.BanksByVOB.length) {
      }
      this.index = null;
    }
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
          if (Actiontype === 'Register') {
            this.CreateVendorOnBoarding(Actiontype);
          }
          else if (Actiontype === 'Save') {
            this.CreateVendorOnBoarding(Actiontype);
          }
          else if (Actiontype === 'delete document') {
            this.removeidentity();
          }
          else if (Actiontype === 'delete') {
            this.removebank();
          }

        }

      });
  }
  ApproveVendor(): void {
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.ApproveVendor(this.SelectedBPVendorOnBoarding).subscribe(
      (data) => {
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Vendor approved successfully', SnackBarStatus.success, 2000);
        this.IsProgressBarVisibile = false;
        this._router.navigate(['/pages/dashboard']);
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger, 2000);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetBPVendorValues(): void {
    this.SelectedBPVendorOnBoarding.primarymail = this.SelectedBPVendorOnBoardingView.primarymail = this.vendorRegistrationFormGroup.get('primarymail').value;
    this.SelectedBPVendorOnBoarding.primaryContact = this.SelectedBPVendorOnBoardingView.primaryContact = this.vendorRegistrationFormGroup.get('primaryContact').value;
  }
  GetBPVendorOnBoardingValues(): void {
    this.SelectedBPVendorOnBoarding.name = this.SelectedBPVendorOnBoardingView.name = this.vendorRegistrationFormGroup.get('Name').value;
    this.SelectedBPVendorOnBoarding.accountGroup = this.SelectedBPVendorOnBoardingView.accountGroup = this.BPVendorOnBoarding.accountGroup;
    this.SelectedBPVendorOnBoarding.department = this.SelectedBPVendorOnBoardingView.department = this.BPVendorOnBoarding.department;
    this.SelectedBPVendorOnBoarding.gstValue = this.SelectedBPVendorOnBoardingView.gstValue = this.BPVendorOnBoarding.gstValue;
    this.SelectedBPVendorOnBoarding.purchaseOrg = this.SelectedBPVendorOnBoardingView.purchaseOrg = this.BPVendorOnBoarding.purchaseOrg;
    this.SelectedBPVendorOnBoarding.companyCode = this.SelectedBPVendorOnBoardingView.companyCode = this.BPVendorOnBoarding.companyCode;
    this.SelectedBPVendorOnBoarding.addressLine1 = this.SelectedBPVendorOnBoardingView.addressLine1 = this.vendorRegistrationFormGroup.get('AddressLine1').value;
    this.SelectedBPVendorOnBoarding.addressLine2 = this.SelectedBPVendorOnBoardingView.addressLine2 = this.vendorRegistrationFormGroup.get('AddressLine2').value;
    this.SelectedBPVendorOnBoarding.stateCode = this.SelectedBPVendorOnBoardingView.stateCode = this.vendorRegistrationFormGroup.get('StateCode').value;
    this.SelectedBPVendorOnBoarding.addressLine3 = this.SelectedBPVendorOnBoardingView.addressLine3 = this.vendorRegistrationFormGroup.get('AddressLine3').value;
    this.SelectedBPVendorOnBoarding.addressLine4 = this.SelectedBPVendorOnBoardingView.addressLine4 = this.vendorRegistrationFormGroup.get('AddressLine4').value;
    this.SelectedBPVendorOnBoarding.addressLine5 = this.SelectedBPVendorOnBoardingView.addressLine5 = this.vendorRegistrationFormGroup.get('AddressLine5').value;

    this.SelectedBPVendorOnBoarding.pinCode = this.SelectedBPVendorOnBoardingView.pinCode = this.vendorRegistrationFormGroup.get('pinCode').value;
    this.SelectedBPVendorOnBoarding.city = this.SelectedBPVendorOnBoardingView.city = this.vendorRegistrationFormGroup.get('city').value;
    this.SelectedBPVendorOnBoarding.country = this.SelectedBPVendorOnBoardingView.country = this.vendorRegistrationFormGroup.get('country').value;
    this.SelectedBPVendorOnBoarding.primaryContact = this.SelectedBPVendorOnBoardingView.primaryContact = this.vendorRegistrationFormGroup.get('primaryContact').value;
    this.SelectedBPVendorOnBoarding.secondaryContact = this.SelectedBPVendorOnBoardingView.secondaryContact = this.vendorRegistrationFormGroup.get('secondaryContact').value;
    this.SelectedBPVendorOnBoarding.primarymail = this.SelectedBPVendorOnBoardingView.primarymail = this.vendorRegistrationFormGroup.get('primarymail').value;
    this.SelectedBPVendorOnBoarding.secondarymail = this.SelectedBPVendorOnBoardingView.secondarymail = this.vendorRegistrationFormGroup.get('secondarymail').value;
    this.SelectedBPVendorOnBoarding.token = this.SelectedBPVendorOnBoardingView.token = this.VendorTokenCheck.Token;
    this.SelectedBPVendorOnBoarding.transID = this.SelectedBPVendorOnBoardingView.transID = this.VendorTokenCheck.TransID;
    this.SelectedBPVendorOnBoarding.gstNumber = this.SelectedBPVendorOnBoardingView.gstNumber = this.vendorRegistrationFormGroup.get('gstNumber').value;
    this.SelectedBPVendorOnBoarding.panNumber = this.SelectedBPVendorOnBoardingView.panNumber = this.vendorRegistrationFormGroup.get('PAN').value;

    this.SelectedBPVendorOnBoarding.certificateNo = this.SelectedBPVendorOnBoardingView.certificateNo = this.vendorRegistrationFormGroup.get('certificateNo').value;
    this.SelectedBPVendorOnBoarding.validFrom = this.SelectedBPVendorOnBoardingView.validFrom = this.vendorRegistrationFormGroup.get('validFrom').value;
    this.SelectedBPVendorOnBoarding.validTo = this.SelectedBPVendorOnBoardingView.validTo = this.vendorRegistrationFormGroup.get('validTo').value;
    this.SelectedBPVendorOnBoarding.registeredCity = this.SelectedBPVendorOnBoardingView.registeredCity = this.vendorRegistrationFormGroup.get('RegisterCity').value;

  }

  GetBPVendorOnBoardingSubItemValues(): void {
    this.GetBPIdentityValues();
    this.GetBPBankValues();
  }

  GetBPIdentityValues(): void {
    // this.SelectedBPVendorOnBoardingView.bPIdentities = [];
    // // this.SelectedBPVendorOnBoardingView.bPIdentities.push(...this.IdentificationsByVOB);
    // this.IdentificationsByVOB.forEach(x => {
    //   if (x.Type) {
    //     this.SelectedBPVendorOnBoardingView.bPIdentities.push(x);
    //   }
    // });
  }

  GetBPBankValues(): void {
    this.SelectedBPVendorOnBoardingView.bPBanks = [];
    this.BanksByVOB.forEach(x => {
      if (x.accountNo) {
        this.SelectedBPVendorOnBoardingView.bPBanks.push(x);
      }
    });
  }



  CreateVendorOnBoarding(ActionType: string): void {
    this.GetBPVendorValues();
    this.GetBPVendorOnBoardingValues();
    this.GetBPVendorOnBoardingSubItemValues();
    const vendorUser: VendorUser = new VendorUser();
    vendorUser.Email = this.SelectedBPVendorOnBoardingView.primarymail;
    vendorUser.Phone = this.SelectedBPVendorOnBoardingView.primaryContact;

    console.log('IdentityTable', this.identificationDataSource.data);

    const MSMEType = this.vendorRegistrationFormGroup.get('MSMEType').value;
    if (MSMEType === "Micro Enterprise") {
      this.SelectedBPVendorOnBoardingView.msmE_TYPE = this.SelectedBPVendorOnBoarding.msmE_TYPE = "INMIC";
    } else if (MSMEType === "Small Enterprise") {
      this.SelectedBPVendorOnBoardingView.msmE_TYPE = this.SelectedBPVendorOnBoarding.msmE_TYPE = "INSML"
    } else if (MSMEType === "Medium Enterprise") {
      this.SelectedBPVendorOnBoardingView.msmE_TYPE = this.SelectedBPVendorOnBoarding.msmE_TYPE = "INMID"
    }
    else if (MSMEType === "Legal Entity Identifier") {
      this.SelectedBPVendorOnBoardingView.msmE_TYPE = this.SelectedBPVendorOnBoarding.msmE_TYPE = "INLEL"
    }
    else {
      this.SelectedBPVendorOnBoardingView.msmE_TYPE = this.SelectedBPVendorOnBoarding.msmE_TYPE = "NA"
    }
    // this.SelectedBPVendorOnBoardingView.createdUser =this.currentUserName;
    this.SelectedBPVendorOnBoardingView.status = ActionType === 'Save' ? ActionType : 'Registered';
    console.log('Save As Draft', this.SelectedBPVendorOnBoardingView, this.fileToUploadList);

    this.IsProgressBarVisibile = true;
    console.log("this.SelectedBPVendorOnBoardingView", this.SelectedBPVendorOnBoardingView)
    this._vendorRegistrationService.UpdateVendorOnBoarding(this.SelectedBPVendorOnBoardingView).subscribe(
      (data) => {
        if (data) {
          this.IsProgressBarVisibile = false;
          this.openSnackBar('Save Succussfully', SnackBarStatus.success);
          if (ActionType === 'Register') {
            this.ClearVendorRegistrationFormGroup();
            this.ClearIdentificationFormGroup();
            this.ClearBankDetailsFormGroup();
            this.ClearInitiatorFormGroup();
            this.IdentificationsByVOB = [];
            this.identificationDataSource = new MatTableDataSource<BPIdentity>(this.IdentificationsByVOB);
            this.BanksByVOB = [];
            this.bankDetailsDataSource = new MatTableDataSource<BPBank>(this.BanksByVOB);

          }
        }
        else {

          this.notificationSnackBarComponent.openSnackBar('Something went wrong', SnackBarStatus.danger);
          this.IsProgressBarVisibile = false;
        }

      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger, 5000);
    this.IsProgressBarVisibile = false;
  }

  UpdateVendorOnBoarding(): void {
    this.SelectedBPVendorOnBoardingView.transID = this.SelectedBPVendorOnBoarding.transID;
    this.SelectedBPVendorOnBoardingView.status = 'Registered';
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.UpdateVendorOnBoarding(this.SelectedBPVendorOnBoardingView).subscribe(
      () => {
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Vendor registration updated successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;

      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  DeleteVendorOnBoarding(): void {
    this.GetBPVendorOnBoardingValues();
    this.IsProgressBarVisibile = true;
    this._vendorRegistrationService.DeleteVendorOnBoarding(this.SelectedBPVendorOnBoarding).subscribe(
      () => {
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('BPVendorOnBoarding deleted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  ShowValidationErrors(formGroup: FormGroup): void {
    let first = false;
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


  SaveClicked(choice: string): void {
    let IdentityCheck = [];
    console.log("vendorRegistrationFormGroup", this.vendorRegistrationFormGroup.value);
    if (this.vendorRegistrationFormGroup.valid && this.pangstvalidate) {
      let IdentityCount = 0;
      this.GetBPVendorOnBoardingValues();
      this.GetBPVendorOnBoardingSubItemValues();
      if (choice.toLowerCase() === 'submit') {
        if (this.IdentificationsByVOB.length > 0 && this.IdentificationsByVOB[0].docType &&
          this.BanksByVOB.length > 0 && this.BanksByVOB[0].accountNo) {
          this.IdentificationsByVOB.forEach(identity => {
            console.log("SaveClicked-identity", identity);
            let arrayData = [];
            let Datacount = 0;
            if (identity.docType !== null && identity.docType != "CANCEL CHEQUE") {
              Datacount++;
            }
            // if(identity.docType == "CANCEL CHEQUE"){
            //   Datacount =  Datacount+2;
            // }
            if (identity.attachmentName == null && identity.docType == "CANCEL CHEQUE") {
              Datacount =  Datacount+2;
              this.cancelcheque = true;
              let error = "Please upload required document";
              this.openSnackBar(error, SnackBarStatus.danger);
            }
            else if (identity.docType == "CANCEL CHEQUE" && identity.attachmentName != null){
              this.cancelcheque = false;
            }
            // if(identity.docType == "CANCEL CHEQUE"){
            //   Datacount =Datacount+2
            // }
            if (identity.attachmentName !== null && identity.attachmentName) {
              Datacount++;
            }
            let data = {
              'Type': identity.docType,
              'Count': Datacount
            }
            IdentityCheck.push(data);

          });
          console.log('IdentityCheck', IdentityCheck);

          for (let i = 0; i < IdentityCheck.length; i++) {
            if (IdentityCheck[i].Count < 2 && IdentityCheck[i].Type !== "Others") {
              if (!this.cancelcheque) {
                if ((IdentityCheck[i].Type == "GSTIN" && this.GSTAttachment) || (IdentityCheck[i].Type == "MSME Certificate" && this.MSMEAttachement) || (IdentityCheck[i].Type == "PAN")) {
                  let error = "Please upload required document";
                  this.openSnackBar(error, SnackBarStatus.danger);
                  break;
                }
                else {
                  IdentityCount++;
                }
              }
              else {
                let error = "Please upload required document";
                this.openSnackBar(error, SnackBarStatus.danger);
                break;
              }

            }

            else {
              IdentityCount++;
            }
            if (IdentityCount === this.identificationDataSource.data.length ) {
              this.OpenConfirmationDialog('Register', 'Vendor');

            }
          }
        }
        else {
          let errorMsg = 'Please add atleast one record for';
          if (this.IdentificationsByVOB.length <= 0 || !this.IdentificationsByVOB[0].docType) {
            errorMsg += ' Identity,';
          }
          if (this.BanksByVOB.length <= 0 || !this.BanksByVOB[0].accountNo) {
            errorMsg += ' Bank,';
          }
          errorMsg = errorMsg.replace(/,\s*$/, '');
          this.notificationSnackBarComponent.openSnackBar(`${errorMsg}`, SnackBarStatus.danger);
        }
      }
      else {
        this.SetActionToOpenConfirmation('Register');
      }
    }
    else if (!this.pangstvalidate) {
      this.openSnackBar('Check PAN and GST Number in Basic details', SnackBarStatus.danger);
    }
    else {
      this.openSnackBar('Please fill all required fields in Basic details', SnackBarStatus.danger);
      this.ShowValidationErrors(this.vendorRegistrationFormGroup);
    }
  }
  savedraft(): void {
    if (this.vendorRegistrationFormGroup.get('primarymail').valid) {

      this.SetActionToOpenConfirmation('Save');
    }
    else {
      this.notificationSnackBarComponent.openSnackBar('Please Enter Primary Mail Field to save as Draft', SnackBarStatus.danger);
    }
  }

  SetActionToOpenConfirmation(actiontype: string): void {
    if (this.BPVendorOnBoarding.transID) {
      const Actiontype = actiontype;
      const Catagory = 'Vendor';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
  }



  handleFileInput(evt): void {

    if(evt.target.files[0].name.length <= 35 ){

      if (evt.target.files && evt.target.files.length > 0) {

        const fileName: string = evt.target.files[0].name;
        const fileExtension: string = fileName.split('.').pop()!.toLowerCase();
        console.log("fileExtension : ",fileExtension);
        if(fileExtension == "pdf" ||fileExtension == "jpeg" ||fileExtension == "jpg" || fileExtension == "doc" ||fileExtension == "docx"){
          this.fileToUpload = evt.target.files[0];
          this.fileToUploadList.push(this.fileToUpload);
        }
        else{
          this.notificationSnackBarComponent.openSnackBar("Kindly upload pdf,image or document file ", SnackBarStatus.danger);

        }

        console.log("3260 : ", evt.target.files[0].name.length)
      }

    }else{
      this.notificationSnackBarComponent.openSnackBar("File name should be with in 35 character ", SnackBarStatus.danger);
    }

  }
  MSMETypeChange(event): void {
    console.log("this.IdentificationsByVOB = ", this.IdentificationsByVOB);
    if (event.value === "Not Applicable") {
      this.MSMEMandatory = false;
      let index = this.IdentificationsByVOB.findIndex(x => x.docType === "MSME Certificate");
      if (index >= 0) {
        this.AllIdentityTypes.forEach((type, indexs) => {
          if (type === "MSME Certificate") {
            this.AllIdentityTypes.splice(indexs, 1);
          }
        });
        this.MSMERow = this.IdentificationsByVOB[index];
        this.IdentificationsByVOB.splice(index, 1);
        this.identificationDataSource = new MatTableDataSource<BPIdentity>(this.IdentificationsByVOB);
      }
      else {
        window.alert('Error' + index);
      }
    }
    else {
      this.MSMEMandatory = true;
      if (this.IdentificationsByVOB.findIndex(x => x.docType === "MSME Certificate") < 0) {
        this.MSMERow.docType = "MSME Certificate";
        this.IdentificationsByVOB.push(this.MSMERow);
        this.AllIdentityTypes.push('MSME Certificate');
        this.identificationDataSource = new MatTableDataSource<BPIdentity>(this.IdentificationsByVOB);
      }
    }
  }

  GetIdentAttachment(element: BPIdentity): void {
    const fileName = element.attachmentName;
    const file = this.fileToUploadList.filter(x => x.name === fileName)[0];
    if (file && file.size) {
      const blob = new Blob([file], { type: file.type });
      saveAs(blob, fileName);

    } else {
      this.IsProgressBarVisibile = true;
      this._vendorRegistrationService.DowloandAttachmentByIDAndName(element.TransID.toString(), fileName).subscribe(
        data => {
          if (data) {
            let fileType = 'image/jpg';
            fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
              fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
                fileName.toLowerCase().includes('.png') ? 'image/png' :
                  fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                    fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
            const blob = new Blob([data], { type: fileType });
            saveAs(blob, fileName);
          }
          this.IsProgressBarVisibile = false;
        },
        error => {
          console.error(error);
          this.IsProgressBarVisibile = false;
        }
      );
    }
  }
  GetAllOnBoardingFieldMaster(): void {
    this._vendorMasterService.GetAllOnBoardingFieldMaster().subscribe(
      (data) => {
        this.AllOnBoardingFieldMaster = data as CBPFieldMaster[];
        //this.InitializeVendorRegistrationFormGroupByFieldMaster();
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetOBDFieldMaster(field: string): CBPFieldMaster {
    if (this.AllOnBoardingFieldMaster && this.AllOnBoardingFieldMaster.length) {

      return this.AllOnBoardingFieldMaster.filter(x => x.field === field)[0];
    }
    return null;
  }
  InitializeGstMandatory(): void {
    this._vendorMasterService.GetGstFieldsMaster().subscribe(
      (data) => {
        this.AllGstFields = data as GSTFields[];
        if (this.BPVendorOnBoarding.gstValue == "Registered") {
          this.GSTAttachment = true;
          Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {
            if (!this.GSTAttachment) {
              if (key == 'gstNumber') {

                this.vendorRegistrationFormGroup.get(key).setValidators([]);
                this.vendorRegistrationFormGroup.get(key).updateValueAndValidity();
              }
            }
            else {

              if (key == 'gstNumber') {

                this.vendorRegistrationFormGroup.get(key).setValidators(
                  [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]);
                this.vendorRegistrationFormGroup.get(key).updateValueAndValidity();
              }
            }
            //}
          });
        }
        else {
          const dup = this.AllGstFields.filter(x => x.code === this.BPVendorOnBoarding.gstValue.substring(0, 1));
          this.GSTAttachment = dup[0].isMandatory;
          if (dup.length > 0) {
            Object.keys(this.vendorRegistrationFormGroup.controls).forEach(key => {
              if (!dup[0].isMandatory) {
                if (key == 'gstNumber') {

                  this.vendorRegistrationFormGroup.get(key).setValidators([]);
                  this.vendorRegistrationFormGroup.get(key).updateValueAndValidity();
                }
              }
              else {
                if (key == 'gstNumber') {

                  this.vendorRegistrationFormGroup.get(key).setValidators([Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]);
                  this.vendorRegistrationFormGroup.get(key).updateValueAndValidity();
                }
              }
            });
          }
        }

      }
    );
  }
}






