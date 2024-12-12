import { Component, OnInit } from '@angular/core';

import { ADMIN_MENU_ITEMS, MENU_ITEMS } from './pages-menu';
import { AuthenticationDetails } from '../models/master';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
  
    <ngx-one-column-layout>
   
      <nb-menu *ngIf="Username != 'Administrator'" [items]="menu"></nb-menu>
      <nb-menu *ngIf="Username == 'Administrator'" [items]="admin_menu"></nb-menu>
       <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  Username: string;
  authenticationDetails: AuthenticationDetails;
  menu = MENU_ITEMS;
  admin_menu = ADMIN_MENU_ITEMS;
  ngOnInit(): void {
    // this.Username = JSON.parse(localStorage.getItem('authorizationData.'));
   
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.Username = this.authenticationDetails.userRole;

      console.log("Username : ", this.Username)
    }
  }

   
  }
