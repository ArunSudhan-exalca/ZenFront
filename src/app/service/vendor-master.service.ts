import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CBPLocation, CBPBank, CBPIdentity, CBPIdentityView, CBPBankView, StateDetails, CBPFieldMaster, CBPDepartment, GSTFields  } from '../models/vendor-master';
@Injectable({
  providedIn: 'root'
})
export class VendorMasterService {

  baseAddress: string;

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // Location
  GetLocationByPincode(Pincode: string): Observable<CBPLocation | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/VendorMaster/GetLocationByPincode?Pincode=${Pincode}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllDepartments(): Observable<CBPDepartment[] | string> {
    return this._httpClient.get<CBPDepartment[]>(`${this.baseAddress}api/VendorMaster/GetAllDepartments`)
      .pipe(catchError(this.errorHandler));
  }
  GetLocation(Pincode: string): Observable<any[]> {
    return this._httpClient.get<any>(`${this.baseAddress}api/VendorMaster/GetLocation?Pincode=${Pincode}`)
      .pipe(catchError(this.errorHandler));
  }
  // SearchTaxPayer(GSTNumber: string): Observable<TaxPayerDetails | string> {
  //   return this._httpClient.get<TaxPayerDetails>(`${this.baseAddress}api/VendorMaster/SearchTaxPayer?GSTNumber=${GSTNumber}`)
  //     .pipe(catchError(this.errorHandler));
  // }
  // GetStateDetails(): Observable<StateDetails[] | string> {
  //   return this._httpClient.get<StateDetails[]>(`${this.baseAddress}api/VendorMaster/GetStateDetails`)
  //     .pipe(catchError(this.errorHandler));
  // }

  GetBankByIFSC(IFSC: string): Observable<CBPBank | string> {
    return this._httpClient.get<CBPBank>(`${this.baseAddress}api/VendorMaster/GetBankByIFSC?IFSC=${IFSC}`)
      .pipe(catchError(this.errorHandler));
  }

  GetIdentityByType(IdentityType: string): Observable<CBPIdentity | string> {
    return this._httpClient.get<CBPIdentity>(`${this.baseAddress}api/VendorMaster/GetIdentityByType?IdentityType=${IdentityType}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllIdentityTypes(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/VendorMaster/GetAllIdentityTypes`)
      .pipe(catchError(this.errorHandler));
  }
  // GetAllCompanyAndAccount(): Observable<any | string> {
  //   return this._httpClient.get<any>(`${this.baseAddress}api/VendorMaster/GetCompanyAndAccount`)
  //     .pipe(catchError(this.errorHandler));
  // }
  GetAllIdentityFields(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/VendorMaster/GetAllIdentityFields`)
      .pipe(catchError(this.errorHandler));
  }
  ValidateIdentityByType(IdentityType: string, ID: string): Observable<CBPIdentity | string> {
    return this._httpClient.get<CBPIdentity>(`${this.baseAddress}api/VendorMaster/ValidateIdentityByType?IdentityType=${IdentityType}&ID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  // GetTaxPayerDetails(Gstin: string): Observable<TaxPayerDetails | string> {
  //   return this._httpClient.get<TaxPayerDetails>(`${this.baseAddress}api/VendorMaster/GetTaxPayerDetails?Gstin=${Gstin}`)
  //     .pipe(catchError(this.errorHandler));
  // }

  // Identity 

  GetAllIdentities(): Observable<CBPIdentityView[] | string> {
    return this._httpClient.get<CBPIdentityView[]>(`${this.baseAddress}api/VendorMaster/GetAllIdentities`)
      .pipe(catchError(this.errorHandler));
  }

  CreateIdentity(identity: CBPIdentityView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/CreateIdentity`,
      identity,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(catchError(this.errorHandler));
  }

  UpdateIdentity(identity: CBPIdentityView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/UpdateIdentity`,
      identity,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(catchError(this.errorHandler));
  }

  DeleteIdentity(identity: CBPIdentityView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/DeleteIdentity`,
      identity,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Bank 

  GetAllBanks(): Observable<CBPBankView[] | string> {
    return this._httpClient.get<CBPBankView[]>(`${this.baseAddress}api/VendorMaster/GetAllBanks`)
      .pipe(catchError(this.errorHandler));
  }

  CreateBank(bank: CBPBankView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/CreateBank`,
      bank,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(catchError(this.errorHandler));
  }

  UpdateBank(bank: CBPBankView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/UpdateBank`,
      bank,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(catchError(this.errorHandler));
  }

  DeleteBank(bank: CBPBankView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/DeleteBank`,
      bank,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllOnBoardingFieldMaster(): Observable<CBPFieldMaster[] | string> {
    return this._httpClient.get<CBPFieldMaster[]>(`${this.baseAddress}api/VendorMaster/GetAllOnBoardingFieldMaster`)
      .pipe(catchError(this.errorHandler));
  }
  GetGstFieldsMaster(): Observable<GSTFields[] | string> {
    return this._httpClient.get<GSTFields[]>(`${this.baseAddress}api/Registration/GetGstDetails`)
      .pipe(catchError(this.errorHandler));
  }
  UpdateOnBoardingFieldMaster(fieldMaster: CBPFieldMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/VendorMaster/UpdateOnBoardingFieldMaster`,
      fieldMaster, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.errorHandler));
  }
}
