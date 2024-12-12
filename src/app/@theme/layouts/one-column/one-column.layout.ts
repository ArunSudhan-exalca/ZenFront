import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `

  <nb-layout windowMode>
  <nb-layout-header fixed *ngIf="sidanavToolbar">
    <ngx-header></ngx-header>
  </nb-layout-header>

  <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive *ngIf="sidanavToolbar">
    <ng-content select="nb-menu"></ng-content>
  </nb-sidebar>

  <nb-layout-column style="padding: 0px;" [ngClass]="{'content-padding' : sidanavToolbar === false}">
    <ng-content select="router-outlet"></ng-content>
  </nb-layout-column>

  <nb-layout-footer fixed *ngIf="sidanavToolbar">
    <ngx-footer></ngx-footer>
  </nb-layout-footer>
</nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  sidanavToolbar: boolean = true;

  constructor(private _router: Router) {

    this._router.events.subscribe({
      next: (response) => {
        // console.log("Navigation End : ", response instanceof NavigationEnd);
        if (response instanceof NavigationEnd) {
          if (response.urlAfterRedirects.includes('/login') || (response.urlAfterRedirects.includes('/register')) || (response.urlAfterRedirects.includes('/Vendorlogin')) || (response.urlAfterRedirects.includes('/VendorResetPassword')) ) {
            this.sidanavToolbar = false;
          }
          else if (response.urlAfterRedirects.includes('/signup') || response.urlAfterRedirects.includes('/login')) {
            this.sidanavToolbar = false;
          }
          else {
            this.sidanavToolbar = true;
          }
        }
      }
    })
  }
}
