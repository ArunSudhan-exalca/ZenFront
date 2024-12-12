import { Guid } from 'guid-typescript';

export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class BPAttachments {
    Type: string;
    Attachments: string;
}
export class BPVendorOnBoarding extends CommonClass {
    transID: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    addressLine5: string;
    city: string;
    country: string;
    pinCode: string;
    stateCode: string;
    // typeofIndustry: string;
    token: string;
    primaryContact: string;
    secondaryContact: string;
    primarymail: string;
    secondarymail: string;
    gstNumber: string;
    gstStatus: string;
    panNumber: string;
    accountGroup: string;
    companyCode: string;
    purchaseOrg: string;
    msmE_TYPE: string;
    department: string;
   
    certificateNo: string;
    validFrom: Date;
    validTo: Date;
    registeredCity: string;
    // certificateStatus: string;
    status: string;
    gstValue:string;
    

}
// public class IdentityAttachments
// {
    
//    TransID :number;
//   DocType :string
// AttachmentName :string
//     ContentType 
//    ContentLength
//     Size
//    Date
//  AttachmentFile
//   IDNumber 
// }
export class BPIdentity extends CommonClass {
    TransID: number;
    docType: string;
    idNumber: string;
    // ValidUntil?: Date;
     DocID: string;
    attachmentName: string;
    ContentType:string;
    ContentLength:number;
    Size:string;
    // BPAttachment: any;
    // IsValid: boolean;
    // Option: any;
    size: string;
    AttachmentFile:number;
    date: Date;
}
// export class BPIdentityView extends CommonClass {
//     transID: number;
//     type: string;
//     iDNumber: string;
//     // ValidUntil?: Date;
//      docID: string;
//     attachmentName: string;
//     // BPAttachment: any;
//     // IsValid: boolean;
//     // Option: any;
//     size: string;
//     date: Date;
// }
export class BPBank extends CommonClass {
    transID: number;
accountNo: string;
ifsc: string;
bankName: string;
    branch: string;
    city: string;
    // DocID: string;
    // AttachmentName: string;
    // BPAttachment: any;
    // IsValid: boolean;
}
export class BPContact extends CommonClass {
    TransID: number;
    // Item: string;
    Name: string;
    Department: string;
    Title: string;
    Mobile: string;
    Email: string;
}
export class BPActivityLog extends CommonClass {
    TransID: number;
    LogID: number;
    Type: string;
    Activity: string;
    Text: string;
    Date?: Date;
    Time: string;
}
export class BPText extends CommonClass {
    TextID: number;
    Text: string;
}

export class BPVendorOnBoardingView extends CommonClass {
    transID: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    addressLine5: string;
    token: string;
    // plant: string;
    stateCode: string;
    city: string;
    // state: string;
    country: string;
    pinCode: string;
    gstNumber: string;
    gstStatus: string;
    panNumber: string;
    // remarkss:string;
    accountGroup: string;
    companyCode: string;
    purchaseOrg: string;
    department: string;
    msmE_TYPE: string;
    // typeofIndustry: string;
    primaryContact: string;
    secondaryContact: string;
    primarymail: string;
    secondarymail: string;
    certificateNo: string;
    validFrom: Date;
    validTo: Date;
    registeredCity: string;
    // certificateStatus: string;
    status: string;
    gstValue:string;
    //bPIdentities: BPIdentity[];
    bPBanks: BPBank[];
    bPContacts: BPContact[];
    plant:string;
    // createdUser:string;
}
export class VendorInitialzation {
    Name: string;
    Email: string;
    AccountGroup: string;
    PurchaseOrg: string;
    CompanyCode: string;
    GSTValue:string;
  CreatedUsername:string;
  CreatedMailID :string;
}
export class IntiatiorDetails {
    acC_Key: string;
    acC_Value: string;
    Company_Key: string;
    Company_Value: string;
}
export class AccountGroup {
    acC_Key: string;
    acC_Value: string;
}
export class Company {
    Company_Key: string;
    Company_Value: string;
}
export class Questionnaires {
    QRID: number;
    QRText: string;
    IsInActive: string;
}
export class QuestionnaireGroup {
    QRGID: number;
    QRID: number;
    Language: string;
    QRGText: string;
    QRGLText: string;
    QRGSortPriority: string;
    DefaultExpanded: string;
}
export class QuestionnaireGroupQuestion {
    QRID: number;
    QRGID: number;
    QID: number;
    IsMandatory: boolean;
    SortPriority: number;
}
export class Question {
    QID: number;
    Language: string;
    QText: string;
    QLText: string;
    QAnsType: string;
}
export class QAnswerChoice {
    ChoiceID: number;
    QID: number;
    Language: string;
    ChoiceText: string;
    IsDefault: boolean;
}

export class Answers {
    AppID: number;
    AppUID: number;
    QRID: number;
    QID: number;
    Answer: string;
    AnsweredBy: Guid;
    AnswredOn: Date;
}
export class QuestionnaireResultSet {
    QRID: number;
    Questionnaire: Questionnaires[];
    QuestionnaireGroup: QuestionnaireGroup[];
    QuestionnaireGroupQuestion: QuestionnaireGroupQuestion[];
    Questions: Question[];
    QuestionAnswerChoices: QAnswerChoice[];
    Answers: Answers[];
}

export class QuestionAnswersView {
    QRID: number;
    QRText: string;
    QRGID: number;
    QRGText: string;
    QID: number;
    Language: string;
    QText: string;
    QLText: string;
    QAnsType: string;
    AppID: number;
    AppUID: number;
    Answer: string;
    AnsweredBy: string;
    AnswredOn: Date | string;
    AnswerChoice: QAnswerChoiceView[];
}

export class QAnswerChoiceView {
    ChoiceID: number;
    QID: number;
    Language: string;
    ChoiceText: string;
    IsDefault: boolean;
}
export class VendorTokenCheck {
    TransID: number;
    EmailAddress: string;
    Token: string;
    IsValid: boolean;
    Message: string;
}
export class AnswerList {
    constructor() {
        this.Answerss = [];
    }
    Answerss: Answers[];
}
