import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthendicationComponent } from './authendication/authendication.component';
import { VendorApprovalComponent } from './vendor-approval/vendor-approval.component';
import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorDashboardComponent } from './vendor-dashboard/dashboard.component';
import { OnBoardingFieldMasterComponent } from './on-boarding-field-master/on-boarding-field-master.component';
import { IdentityComponent } from './identity/identity.component';
import { InitiatorComponent } from './initiator/initiator.component';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { VendorloginComponent } from './vendorlogin/vendorlogin.component';
import {VendorResetPasswordPageComponent} from './vendor-reset-password-page/vendor-reset-password-page.component';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path : 'login',
      component : AuthendicationComponent
    },
    {
      path : '',
      redirectTo : 'login',
      pathMatch : 'full'
    },
  {
    path:'Vendorlogin',
    component : VendorloginComponent,
  },
    {
      path:'VendorResetPassword',
      component : VendorResetPasswordPageComponent,
    },
    {
      path : 'approval',
      component : VendorApprovalComponent,

    },


      // {
      //   path : ':ID',
      //   component : VendorApprovalComponent
      // },

    {
      path : 'register',
      component : VendorRegisterComponent
    },
    {
      path : 'dashboard',
      component : VendorDashboardComponent
    },
    {
      path:'obdfield',
      component:OnBoardingFieldMasterComponent,
    }
    , {
      path:'identity',
      component:IdentityComponent,
    },
    {
      path:'initiator',
      component:InitiatorComponent
    },
    {
      path:'usercreation',
      component:UserCreationComponent
    }
    // {
    //   path : 'new-document',
    //   component : NewDocumentComponent
    // },
    // {
    //   path : 'outbox',
    //   component : OutboxComponent
    // },
    // {
    //   path : 'digital-signing',
    //   component : DigitalSigningComponent
    // },
    // {
    //   path : 'users',
    //   component : UserComponent
    // },
    // {
    //   path:'signup',
    //   component:SignupComponent
    // }
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    // TranslateModule.forRoot(),
 // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
