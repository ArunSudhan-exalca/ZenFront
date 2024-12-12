import { NgModule } from '@angular/core';
import { NbDatepickerModule,NbCheckboxModule, NbFormFieldModule, NbInputModule, NbMenuModule,NbSelectModule, NbAutocompleteModule, NbTooltipModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AuthendicationComponent } from './authendication/authendication.component';
import { NotificationSnackBarComponent } from './notification-snack-bar/notification-snack-bar.component';
import { ForgetPasswordLinkDialogComponent } from './forget-password-link-dialog/forget-password-link-dialog.component';
import { NbCardModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import { MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { VendorApprovalComponent } from './vendor-approval/vendor-approval.component';
import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorDashboardComponent } from './vendor-dashboard/dashboard.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { OnBoardingFieldMasterComponent } from './on-boarding-field-master/on-boarding-field-master.component';
import { NbIconModule } from '@nebular/theme';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { IdentityComponent } from './identity/identity.component';
import { InitiatorComponent } from './initiator/initiator.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog/forgot-password-dialog.component';
import { VendorloginComponent } from './vendorlogin/vendorlogin.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectSearchModule } from 'mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { AttachmentDialogComponent } from './attachment-dialog/attachment-dialog.component';
import { VendorResetPasswordPageComponent } from './vendor-reset-password-page/vendor-reset-password-page.component';
import { NgOtpInputModule } from 'ng-otp-input';

// import { Identity}
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NbMenuModule,
    NbIconModule,
    MatDialogModule,
    FormsModule,
    MatSortModule,
    MatFormFieldModule,
    MatCheckboxModule,
    NbTooltipModule,
    MatInputModule,
    MiscellaneousModule,
    NbCardModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbInputModule,
    NbFormFieldModule,MatSnackBarModule,
    NbAutocompleteModule,
    NgxMatSelectSearchModule,
    MatSelectSearchModule,
    MatSelectModule,
    NgOtpInputModule,

  ],
  declarations: [
    PagesComponent,
    AuthendicationComponent,
    NotificationSnackBarComponent,
    ForgetPasswordLinkDialogComponent,
    VendorApprovalComponent,
    VendorRegisterComponent,
    VendorDashboardComponent,
    NotificationDialogComponent,
    AttachmentDialogComponent,
    OnBoardingFieldMasterComponent,
    IdentityComponent,
    InitiatorComponent,
    UserCreationComponent,
    ForgotPasswordDialogComponent,
    VendorloginComponent,
    VendorResetPasswordPageComponent,


  ],
})
export class PagesModule {
}
