import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
// import 
// import { BPVendorOnBoarding, BPIdentity, BPBank, BPContact, BPActivityLog, BPVendorOnBoardingView, QuestionnaireResultSet, Answers, QuestionAnswersView, AnswerList, VendorTokenCheck } from 'app/models/vendor-registration';
import { Guid } from 'guid-typescript';
import { VendorTokenCheck, BPVendorOnBoarding, BPIdentity, BPBank, BPContact, BPActivityLog, BPVendorOnBoardingView, QuestionnaireResultSet, Answers, QuestionAnswersView, AnswerList, VendorInitialzation } from '../models/vendor-registration';
@Injectable({
  providedIn: 'root'
})
export class VendorRegistrationService {

  baseAddress: string;
  questionnaireBaseAddress: string;
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.questionnaireBaseAddress = _authService.questionnaireBaseAddress;
  }
  CheckTokenValidity(VendorToken: VendorTokenCheck): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/ChectTokenValidity`,
      VendorToken,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // VendorOnBoardings
  GetAllVendorOnBoardings(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllVendorOnBoardings`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllOpenVendorOnBoardings(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllOpenVendorOnBoardings`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllOpenVendorOnBoardingsByApprover(Approver: string): Observable<any | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/Registration/GetAllOpenVendorOnBoardingsByApprover?Approver=${Approver}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllPendingVendorOnBoardingsByApprover(Approver: string): Observable<any | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/Registration/GetAllPendingVendorOnBoardings?Approver=${Approver}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllOpenVendorOnBoardingsByPlant(Plants: string[]): Observable<any | string> {
    return this._httpClient.post<any[]>(`${this.baseAddress}api/Registration/GetAllOpenVendorOnBoardingsByPlant`, Plants)
      .pipe(catchError(this.errorHandler));
  }
  GetAllApprovedVendorOnBoardings(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllApprovedVendorOnBoardings`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllRejectedVendorOnBoardings(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllRejectedVendorOnBoardings`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllOpenVendorOnBoardingsCountByApprover(Approver: string): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllOpenVendorOnBoardingsCountByApprover?Approver=${Approver}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllOpenVendorOnBoardingsCount(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllOpenVendorOnBoardingsCount`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllApprovedVendorOnBoardingsCount(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllApprovedVendorOnBoardingsCount`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllRejectedVendorOnBoardingsCount(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetAllRejectedVendorOnBoardingsCount`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllRejectedVendorOnBoardingsByPlant(plants: string[]): Observable<BPVendorOnBoarding[] | string> {
    return this._httpClient.post<any[]>(`${this.baseAddress}api/Registration/GetAllRejectedVendorOnBoardingsByPlant`, plants)
      .pipe(catchError(this.errorHandler));
  }
  GetAllRejectedVendorOnBoardingsByApprover(Approver: string): Observable<BPVendorOnBoarding[] | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/Registration/GetAllRejectedVendorOnBoardingsByApprover?Approver=${Approver}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllApprovedVendorOnBoardingsByPlant(plants: string[]): Observable<BPVendorOnBoarding[] | string> {
    return this._httpClient.post<any[]>(`${this.baseAddress}api/Registration/GetAllApprovedVendorOnBoardingsByPlant`, plants)
      .pipe(catchError(this.errorHandler));
  }
  GetAllApprovedVendorOnBoardingsByApprover(Approver: string): Observable<BPVendorOnBoarding[] | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/Registration/GetAllApprovedVendorOnBoardingsByApprover?Approver=${Approver}`)
      .pipe(catchError(this.errorHandler));
  }
  GetVendorOnBoardingsByID(TransID: number): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetVendorOnBoardingsByID?TransID=${TransID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetVendorOnBoardingsByEmailID(EmailID: string): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetVendorOnBoardingsByEmailID?EmailID=${EmailID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetRegisteredVendorOnBoardings(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetRegisteredVendorOnBoardings`)
      .pipe(catchError(this.errorHandler));
  }

  CreateVendorOnBoarding(VendorOnBoarding: BPVendorOnBoardingView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/CreateVendorOnBoarding`,
      VendorOnBoarding,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateVendorOnBoarding(VendorOnBoarding: BPVendorOnBoardingView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/UpdateVendorOnBoarding`,
      VendorOnBoarding,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  // UpdateVendorOnBoarding(): Observable<any | string> {
  //   return this._httpClient.get<any>(`${this.baseAddress}api/Registration/UpdateVendor`)
  //     .pipe(catchError(this.errorHandler));
  // }
  DeleteVendorOnBoarding(VendorOnBoarding: BPVendorOnBoarding): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/DeleteVendorOnBoarding`,
      VendorOnBoarding,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  ApproveVendor(VendorOnBoarding: BPVendorOnBoarding): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/ApproveVendor`,
      VendorOnBoarding,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  RejectVendor(VendorOnBoarding: BPVendorOnBoarding): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/RejectVendor`,
      VendorOnBoarding,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }


  GetIdentificationsByVOB(TransID: number): Observable<any[] | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/VendorMaster/GetIdentitiesByVOB?TransID=${TransID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetBanksByVOB(TransID: number): Observable<BPBank[] | string> {
    return this._httpClient.get<BPBank[]>(`${this.baseAddress}api/Registration/GetBanksByVOB?TransID=${TransID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetContactsByVOB(TransID: number): Observable<BPContact[] | string> {
    return this._httpClient.get<BPContact[]>(`${this.baseAddress}api/Registration/GetContactsByVOB?TransID=${TransID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetActivityLogsByVOB(TransID: number): Observable<BPActivityLog[] | string> {
    return this._httpClient.get<BPActivityLog[]>(`${this.baseAddress}api/Registration/GetActivityLogsByVOB?TransID=${TransID}`)
      .pipe(catchError(this.errorHandler));
  }

  AddUserAttachment(fileuploaddate:Date,IDNumber: string, size: number, TransID: number, CreatedBy: string, selectedFiles: File, perviousFileName = null, FileType: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append(selectedFiles.name, selectedFiles, selectedFiles.name);
    console.log("TransID", TransID.toString());
    const id = TransID.toString();
    formData.append('TransID', id);
    formData.append('PerviousFileName', perviousFileName);
    formData.append('CreatedBy', CreatedBy.toString());
    formData.append('FileType', FileType);
    formData.append('IDNumber', IDNumber);
    formData.append('size', size.toString());
formData.append('fileuploaddate',fileuploaddate.toDateString())
    // formData.append('IDnumber',IDnumber.toString());
    // formData.append('size',size.toString());
    return this._httpClient.post<any>(`${this.baseAddress}api/Attachment/AddUserAttachment`,
      formData,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }
  DeleteIdentityofVOB(TransID: number, Doctype: string): Observable<any[] | string> {
    return this._httpClient.get<BPIdentity[]>(`${this.baseAddress}api/VendorMaster/GetIdentitiesDeleteByVOB?TransID=${TransID}&Doctype=${Doctype}`)
      .pipe(catchError(this.errorHandler));
  }
  CreateBank(BPBank: BPBank): Observable < any > {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/CreateBank`,
    BPBank,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  UpdateBank(BPBank: BPBank): Observable < any > {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/UpdateBank`,
    BPBank,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  DeleteBank(BPBank: BPBank): Observable < any > {
    return this._httpClient.post<any>(`${this.baseAddress}api/Registration/DeleteBank`,
    BPBank,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
 
DowloandAttachment(AttachmentName: string, ASNNumber: string): Observable < Blob | string > {
  return this._httpClient.get(`${this.baseAddress}api/Attachment/DowloandInvoiceAttachment?AttachmentName=${AttachmentName}&ASNNumber=${ASNNumber}`, {
    responseType: 'blob',
    headers: new HttpHeaders().append('Content-Type', 'application/json')
  })
    .pipe(catchError(this.errorHandler));
}
GetIdentityAttachment(AppNumber: string, HeaderNumber: string, AttachmentName: string): Observable < Blob | string > {
  return this._httpClient.get(`${this.baseAddress}api/Attachment/GetIdentityAttachment?AppNumber=${AppNumber}&HeaderNumber=${HeaderNumber}&AttachmentName=${AttachmentName}`, {
    responseType: 'blob',
    headers: new HttpHeaders().append('Content-Type', 'application/json')
  })
    .pipe(catchError(this.errorHandler));
}
DowloandAttachmentByIDAndName(AttachmentId: string, AttachmentName: string): Observable < Blob | string > {
  return this._httpClient.get(`${this.baseAddress}api/Attachment/DowloandAttachmentByIDAndName?HeaderNumber=${AttachmentId}&AttachmentName=${AttachmentName}`, {
    responseType: 'blob',
    headers: new HttpHeaders().append('Content-Type', 'application/json')
  })
    .pipe(catchError(this.errorHandler));
}
GetQuestionnaireResultSetByQRID(): Observable < QuestionnaireResultSet | string > {
  return this._httpClient.get<QuestionnaireResultSet>(`${this.baseAddress}api/Registration/GetQuestionnaireResultSetByQRID`)
    .pipe(catchError(this.errorHandler));
}
GetQuestionAnswers(QRText: string, QRGText: string): Observable < QuestionAnswersView[] | string > {
  return this._httpClient.get<QuestionAnswersView[]>
    (`${this.questionnaireBaseAddress}api/Questionnaire/GetQuestionAnswers?QRText=${QRText}&QRGText=${QRGText}`)
    .pipe(catchError(this.errorHandler));
}
GetQuestionAnswersByUser(QRText: string, QRGText: string, UserID: Guid): Observable < QuestionAnswersView[] | string > {
  return this._httpClient.get<QuestionAnswersView[]>
    (`${this.questionnaireBaseAddress}api/Questionnaire/GetQuestionAnswersByUser?QRText=${QRText}&QRGText=${QRGText}&UserID=${UserID}`)
    .pipe(catchError(this.errorHandler));
}
SaveAnswers(answerList: AnswerList): Observable < any > {
  return this._httpClient.post<any>(`${this.questionnaireBaseAddress}api/Questionnaire/SaveAnswers`,
    answerList,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(catchError(this.errorHandler));
}
GetAllCompanyAndAccount(): Observable < any | string > {
  return this._httpClient.get<any>(`${this.baseAddress}api/Registration/GetCompanyAndAccount`)
    .pipe(catchError(this.errorHandler));
}
InitiateVendorOnBoarding(VendorOnBoarding: VendorInitialzation): Observable < any > {
  return this._httpClient.post<any>(`${this.baseAddress}api/Registration/InitializeVendorRegistration`,
    VendorOnBoarding,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(catchError(this.errorHandler));
}
}
