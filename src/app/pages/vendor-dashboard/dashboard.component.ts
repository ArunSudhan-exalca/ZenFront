import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
} from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationDetails } from '../../models/master';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import { BPVendorOnBoarding } from '../../models/vendor-registration';
import { VendorRegistrationService } from '../../service/vendor-registration.service';
import { SnackBarStatus } from '../notification-snack-bar/notification-snackbar-status-enum';

@Component({
    selector: 'ngx-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,


})
export class VendorDashboardComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserName: string;
    currentUserRole: string;
    MenuItems: string[];
    PlantList: string[] = [];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    IsProgressBarVisibile: boolean;
    VendorOnBoardingsDisplayedColumns: string[] = [
        'TransId',
        'Name',
        'Country',
        'Phone1',
        'Email1',
        'CreatedOn',
        'Status',

    ];
    VendorOnBoardingsDataSource: MatTableDataSource<BPVendorOnBoarding>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);
    searchText = '';
    getvalue: string;
    AllVendorOnBoardings: BPVendorOnBoarding[] = [];
    public tab1: boolean;
    public tab2: boolean;
    public tab3: boolean;
    public tabCount: number;
    public OpenCount: number;
    public ApprovedCount: number;
    public RejectedCount: number;
    public PendingCount: number;

    constructor(
        public snackBar: MatSnackBar,
        private _router: Router,
        private _vendorRegistrationService: VendorRegistrationService
    ) {
        this.authenticationDetails = new AuthenticationDetails();
        this.IsProgressBarVisibile = false;
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        this.tabCount = 1;
        this.getvalue = localStorage.getItem('Reloaddata')
        if (this.getvalue == "true") {
            window.location.reload();
            localStorage.setItem('Reloaddata', JSON.stringify(false))
        }
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(
                retrievedObject
            ) as AuthenticationDetails;
            this.currentUserID = this.authenticationDetails.userID;
            this.currentUserRole = this.authenticationDetails.userRole;
            this.currentUserName = this.authenticationDetails.userName;
            this.MenuItems = this.authenticationDetails.menuItemNames.split(
                ','
            );
            if (this.MenuItems.indexOf('Admin Dashboard') < 0) {
                this.notificationSnackBarComponent.openSnackBar(
                    'You do not have permission to visit this page',
                    SnackBarStatus.danger
                );
                this._router.navigate(['/auth/login']);
            }
            //   if (this.currentUserRole === 'Approver') {
            // this._masterService
            //     .GetApproverPlants(this.currentUserID)
            //     .subscribe((data) => {
            //         this.PlantList = data as string[];
            //         if (this.PlantList.length > 0) {
            //             this.GetAllOpenVendorOnBoardings();
            //             this.GetAllApprovedVendorOnBoardingsCount();
            //             this.GetAllRejectedVendorOnBoardingsCount();
            //         }
            //     });
            //this.GetAllApprovedVendorOnBoardings();
            this.GetAllPendingVendorOnBoarding();
            this.GetAllOpenVendorOnBoardings();
            // this.GetAllApprovedVendorOnBoardingsCount();
            //this.GetAllRejectedVendorOnBoardingsCount();
            //   } else {
            //       this.GetAllOpenVendorOnBoardings();
            //       //this.GetAllApprovedVendorOnBoardingsCount();
            //       //this.GetAllRejectedVendorOnBoardingsCount();
            //   }
            // this.GetAllUserWithRoles();
        } else {
            this._router.navigate(['/auth/login']);
        }
    }

    tabone(): void {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.GetAllOpenVendorOnBoardings();
        this.tabCount = 1;
    }

    tabtwo(): void {
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        //this.GetAllApprovedVendorOnBoardings();
        this.tabCount = 2;
    }

    tabthree(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = true;
        this.GetAllPendingVendorOnBoarding()
        //this.GetAllRejectedVendorOnBoardings();
        this.tabCount = 3;
    }

    //   GetAllVendorOnBoardings(): void {
    //       this.IsProgressBarVisibile = true;
    //       this._vendorRegistrationService.GetAllVendorOnBoardings().subscribe(
    //           (data) => {
    //               this.IsProgressBarVisibile = false;
    //               this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
    //              // window.location.reload();
    //               this.VendorOnBoardingsDataSource = new MatTableDataSource(
    //                   this.AllVendorOnBoardings
    //               );
    //               this.VendorOnBoardingsDataSource.paginator = this.paginator;
    //               this.VendorOnBoardingsDataSource.sort = this.sort;
    //               console.log("GetAllVendorOnBoardings", this.AllVendorOnBoardings);
    //           },
    //           (err) => {
    //               console.error(err);
    //               this.IsProgressBarVisibile = false;
    //               this.notificationSnackBarComponent.openSnackBar(
    //                   err instanceof Object ? 'Something went wrong' : err,
    //                   SnackBarStatus.danger
    //               );
    //           }
    //       );
    //   }
    GetAllPendingVendorOnBoarding(): void {
        this.IsProgressBarVisibile = true;
        if (this.currentUserRole === 'Initiator') {
            this._vendorRegistrationService
                .GetAllPendingVendorOnBoardingsByApprover(this.currentUserName)
                .subscribe(
                    (data) => {
                        console.log(data);
                        this.IsProgressBarVisibile = false;
                        this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
                        if (
                            this.AllVendorOnBoardings &&
                            this.AllVendorOnBoardings.length > 0
                        ) {
                            this.PendingCount = this.AllVendorOnBoardings.length;
                            this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                this.AllVendorOnBoardings
                            );
                            this.VendorOnBoardingsDataSource.paginator = this.paginator;
                            this.VendorOnBoardingsDataSource.sort = this.sort;
                        } else {
                            this.PendingCount = 0;
                            this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                this.AllVendorOnBoardings
                            );
                            this.VendorOnBoardingsDataSource.paginator = this.paginator;
                            this.VendorOnBoardingsDataSource.sort = this.sort;
                        }
                        console.log("GetAllPendingVendorOnBoardings", this.AllVendorOnBoardings);
                    },
                    (err) => {
                        console.error(err);
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(
                            err instanceof Object
                                ? 'Something went wrong'
                                : err,
                            SnackBarStatus.danger
                        );
                    }
                );
        }
    }
    GetAllOpenVendorOnBoardings(): void {
        this.IsProgressBarVisibile = true;
        if (this.currentUserRole === 'Initiator') {
            this._vendorRegistrationService
                .GetAllOpenVendorOnBoardingsByApprover(this.currentUserName)
                .subscribe(
                    (data) => {
                        this.IsProgressBarVisibile = false;
                        this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
                        if (
                            this.AllVendorOnBoardings &&
                            this.AllVendorOnBoardings.length > 0
                        ) {
                            this.OpenCount = this.AllVendorOnBoardings.length;
                            this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                this.AllVendorOnBoardings
                            );
                            this.VendorOnBoardingsDataSource.paginator = this.paginator;
                            this.VendorOnBoardingsDataSource.sort = this.sort;
                        } else {
                            this.OpenCount = 0;
                            this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                this.AllVendorOnBoardings
                            );
                            this.VendorOnBoardingsDataSource.paginator = this.paginator;
                            this.VendorOnBoardingsDataSource.sort = this.sort;
                        }
                        console.log("GetAllOpenVendorOnBoardings", this.AllVendorOnBoardings);
                    },
                    (err) => {
                        console.error(err);
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(
                            err instanceof Object
                                ? 'Something went wrong'
                                : err,
                            SnackBarStatus.danger
                        );
                    }
                );
        } else {
            this._vendorRegistrationService
                .GetAllOpenVendorOnBoardings()
                .subscribe(
                    (data) => {
                        this.IsProgressBarVisibile = false;
                        this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
                        if (
                            this.AllVendorOnBoardings &&
                            this.AllVendorOnBoardings.length > 0
                        ) {
                            this.OpenCount = this.AllVendorOnBoardings.length;
                            this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                this.AllVendorOnBoardings
                            );
                            this.VendorOnBoardingsDataSource.paginator = this.paginator;
                            this.VendorOnBoardingsDataSource.sort = this.sort;
                        } else {
                            this.OpenCount = 0;
                            this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                this.AllVendorOnBoardings
                            );
                            this.VendorOnBoardingsDataSource.paginator = this.paginator;
                            this.VendorOnBoardingsDataSource.sort = this.sort;
                        }
                    },
                    (err) => {
                        console.error(err);
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(
                            err instanceof Object
                                ? 'Something went wrong'
                                : err,
                            SnackBarStatus.danger
                        );
                    }
                );
        }
    }
    // masterToggle(): void {
    //     if (this.isAllSelected()) {
    //         this.selection.clear();
    //         return;
    //     }
    //     this.VendorOnBoardingsDataSource.data.forEach(element => {
    //         this.selection.select(element);
    //     });
    //     // this.selection.select(...this.dataSource.data);
    // }
    // isAllSelected(): boolean {
    //     const numSelected = this.selection.selected.length;
    //     const numRows = this.VendorOnBoardingsDataSource.data.length;
    //     return numSelected === numRows;
    // }
      GetAllApprovedVendorOnBoardings(): void {
          this.IsProgressBarVisibile = true;
          if (this.currentUserRole === 'Approver') {
              this._vendorRegistrationService
                  .GetAllApprovedVendorOnBoardingsByApprover(this.currentUserName)
                  .subscribe(
                      (data) => {
                          this.IsProgressBarVisibile = false;
                          this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
                          if (
                              this.AllVendorOnBoardings &&
                              this.AllVendorOnBoardings.length > 0
                          ) {
                              this.ApprovedCount = this.AllVendorOnBoardings.length;
                              this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                  this.AllVendorOnBoardings
                              );
                              this.VendorOnBoardingsDataSource.paginator = this.paginator;
                              this.VendorOnBoardingsDataSource.sort = this.sort;
                          } else {
                              this.ApprovedCount = 0;
                              this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                  this.AllVendorOnBoardings
                              );
                              this.VendorOnBoardingsDataSource.paginator = this.paginator;
                              this.VendorOnBoardingsDataSource.sort = this.sort;
                          }
                      },
                      (err) => {
                          console.error(err);
                          this.IsProgressBarVisibile = false;
                          this.notificationSnackBarComponent.openSnackBar(
                              err instanceof Object
                                  ? 'Something went wrong'
                                  : err,
                              SnackBarStatus.danger
                          );
                      }
                  );
          } else {
              this._vendorRegistrationService
                  .GetAllApprovedVendorOnBoardings()
                  .subscribe(
                      (data) => {
                          this.IsProgressBarVisibile = false;
                          this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
                          if (
                              this.AllVendorOnBoardings &&
                              this.AllVendorOnBoardings.length > 0
                          ) {
                              this.ApprovedCount = this.AllVendorOnBoardings.length;
                              this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                  this.AllVendorOnBoardings
                              );
                              this.VendorOnBoardingsDataSource.paginator = this.paginator;
                              this.VendorOnBoardingsDataSource.sort = this.sort;
                          } else {
                              this.ApprovedCount = 0;
                              this.VendorOnBoardingsDataSource = new MatTableDataSource(
                                  this.AllVendorOnBoardings
                              );
                              this.VendorOnBoardingsDataSource.paginator = this.paginator;
                              this.VendorOnBoardingsDataSource.sort = this.sort;
                          }
                      },
                      (err) => {
                          console.error(err);
                          this.IsProgressBarVisibile = false;
                          this.notificationSnackBarComponent.openSnackBar(
                              err instanceof Object
                                  ? 'Something went wrong'
                                  : err,
                              SnackBarStatus.danger
                          );
                      }
                  );
          }
      }

    //   GetAllRejectedVendorOnBoardings(): void {
    //       this.IsProgressBarVisibile = true;
    //       if (this.currentUserRole === 'Approver') {

    //           this._vendorRegistrationService
    //               .GetAllRejectedVendorOnBoardingsByApprover(this.currentUserName)
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
    //                       if (
    //                           this.AllVendorOnBoardings &&
    //                           this.AllVendorOnBoardings.length > 0
    //                       ) {
    //                           this.RejectedCount = this.AllVendorOnBoardings.length;
    //                           this.VendorOnBoardingsDataSource = new MatTableDataSource(
    //                               this.AllVendorOnBoardings
    //                           );
    //                           this.VendorOnBoardingsDataSource.paginator = this.paginator;
    //                           this.VendorOnBoardingsDataSource.sort = this.sort;
    //                       } else {
    //                           this.RejectedCount = 0;
    //                           this.VendorOnBoardingsDataSource = new MatTableDataSource(
    //                               this.AllVendorOnBoardings
    //                           );
    //                           this.VendorOnBoardingsDataSource.paginator = this.paginator;
    //                           this.VendorOnBoardingsDataSource.sort = this.sort;
    //                       }
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object ? 'Something went wrong' : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       }
    //       else {
    //           this._vendorRegistrationService
    //               .GetAllRejectedVendorOnBoardings()
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.AllVendorOnBoardings = <BPVendorOnBoarding[]>data;
    //                       if (
    //                           this.AllVendorOnBoardings &&
    //                           this.AllVendorOnBoardings.length > 0
    //                       ) {
    //                           this.RejectedCount = this.AllVendorOnBoardings.length;
    //                           this.VendorOnBoardingsDataSource = new MatTableDataSource(
    //                               this.AllVendorOnBoardings
    //                           );
    //                           this.VendorOnBoardingsDataSource.paginator = this.paginator;
    //                           this.VendorOnBoardingsDataSource.sort = this.sort;
    //                       } else {
    //                           this.RejectedCount = 0;
    //                           this.VendorOnBoardingsDataSource = new MatTableDataSource(
    //                               this.AllVendorOnBoardings
    //                           );
    //                           this.VendorOnBoardingsDataSource.paginator = this.paginator;
    //                           this.VendorOnBoardingsDataSource.sort = this.sort;
    //                       }
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object ? 'Something went wrong' : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       }
    //   }

    //   GetAllOpenVendorOnBoardingsCount(): void {
    //       this.IsProgressBarVisibile = true;
    //       if (this.currentUserRole === 'Approver') {
    //           this._vendorRegistrationService
    //               .GetAllOpenVendorOnBoardingsCountByApprover(this.currentUserName)
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.OpenCount = <any>data;
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object ? 'Something went wrong' : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       } else {
    //           this._vendorRegistrationService
    //               .GetAllOpenVendorOnBoardingsCount()
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.OpenCount = <any>data;
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object ? 'Something went wrong' : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       }
    //   }

    //   GetAllApprovedVendorOnBoardingsCount(): void {
    //       this.IsProgressBarVisibile = true;
    //       if (this.currentUserRole === 'Approver') {
    //           this._vendorRegistrationService
    //               .GetAllApprovedVendorOnBoardingsByApprover(this.currentUserName)
    //               .subscribe(
    //                   (data) => {
    //                       console.log(
    //                           'GetAllApprovedVendorOnBoardingsByPlant',
    //                           data
    //                       );
    //                       this.IsProgressBarVisibile = false;
    //                       this.ApprovedCount = data.length;
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object
    //                               ? 'Something went wrong'
    //                               : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       } else {
    //           this._vendorRegistrationService
    //               .GetAllApprovedVendorOnBoardingsCount()
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.ApprovedCount = <any>data;
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object
    //                               ? 'Something went wrong'
    //                               : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       }
    //   }

    //   GetAllRejectedVendorOnBoardingsCount(): void {
    //       this.IsProgressBarVisibile = true;
    //       if (this.currentUserRole === 'Approver') {
    //           this._vendorRegistrationService
    //               .GetAllRejectedVendorOnBoardingsByApprover(this.currentUserName)
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.RejectedCount = data.length;
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object
    //                               ? 'Something went wrong'
    //                               : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       } else {
    //           this._vendorRegistrationService
    //               .GetAllRejectedVendorOnBoardingsCount()
    //               .subscribe(
    //                   (data) => {
    //                       this.IsProgressBarVisibile = false;
    //                       this.RejectedCount = <any>data;
    //                   },
    //                   (err) => {
    //                       console.error(err);
    //                       this.IsProgressBarVisibile = false;
    //                       this.notificationSnackBarComponent.openSnackBar(
    //                           err instanceof Object
    //                               ? 'Something went wrong'
    //                               : err,
    //                           SnackBarStatus.danger
    //                       );
    //                   }
    //               );
    //       }
    //   }

    // GetAllUserWithRoles(): void {
    //     this._masterService.GetAllUsers().subscribe(
    //         (data) => {
    //             this.AllUserWithRoles = <UserWithRole[]>data;
    //         },
    //         (err) => {
    //             console.log(err);
    //         }
    //     );
    // }
    ReviewAndApproveVendor(bPVendorOnBoarding: BPVendorOnBoarding): void {
        localStorage.setItem('TransID', JSON.stringify(bPVendorOnBoarding.transID))
        this._router.navigate(['pages/approval']);
    }
    //   ReviewAndApproveVendor(bPVendorOnBoarding: BPVendorOnBoarding): void {
    //       this._router.navigate(['pages/approval']);
    //   }
    //   applyFilter(event: Event) {
    //       const filterValue = (event.target as HTMLInputElement).value;
    //       this.VendorOnBoardingsDataSource.filter = filterValue.trim().toLowerCase();
    //   }


    //   masterToggle(): void {
    //     if (this.isAllSelected()) {
    //       this.selection.clear();
    //       return;
    //     }
    //     this.VendorOnBoardingsDataSource.data.forEach(element => {
    //       this.selection.select(element);
    //     });

    //   }
    //   isAllSelected(): boolean {
    //     const numSelected = this.selection.selected.length;
    //     const numRows = this.VendorOnBoardingsDataSource.data.length;
    //     return numSelected === numRows;
    //   }
    //   Review(){
    //     this._router.navigate(['pages/vendor']);
    //   }

    
}
