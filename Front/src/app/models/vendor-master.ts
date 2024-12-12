export class CommonClass {
    isActive: boolean;
    createdOn: Date;
    createdBy: string;
    modifiedOn?: Date;
    modifiedBy: string;
}

export class CBPType extends CommonClass {
    Type: string;
    Language: string;
    Text: string;
}
export class CBPPostal extends CommonClass {
    PostalCode: string;
    Country: string;
    State: string;
    City: string;
    AddressLine1: string;
    AddressLine2: string;
}
export class CBPBank extends CommonClass {
    BankCode: string;
    BankName: string;
    BankCity: string;
    BankCountry: string;
    BankBranch: string;
}
export class CBPTitle extends CommonClass {
    Title: string;
    Language: string;
    TitleText: string;
}
export class CBPDepartment extends CommonClass {
    department: string;
    language: string;
    text: string;
}
export class CBPApp extends CommonClass {
    ID: string;
    CCode: string;
    Type: string;
    Level: string;
    User: string;
    StartDate?: Date;
    EndDate?: Date;
}
export class CBPLocation extends CommonClass {
    Pincode: string;
    Location: string;
    Taluk: string;
    District: string;
    State: string;
    StateCode: string;
    Country: string;
    CountryCode: string;
}
export class CBPIdentity extends CommonClass {
    ID: number;
    type: string;
    text:string;
    format: string;
    docReq: string;
    // expDateReq: Date;
    // country: string;
}
export class CBPIdentityView extends CommonClass {
    ID: number;
    type: string;
    format: string;
    text:string;
    docReq: string;
    // expDateReq: Date;
    // country: string;
}
export class CBPBankView extends CommonClass {
    BankCode: string;
    BankName: string;
    BankCity: string;
    BankCountry: string;
    BankBranch: string;
}
// export class TaxPayerDetails {
//     gstin: string;
//     tradeName: string;
//     legalName: string;
//     address1: string;
//     address2: string;
//     stateCode: string;
//     pinCode: string;
//     txpType: string;
//     status: string;
//     blkStatus: string;
// }
export class StateDetails {
    State: string;
    StateCode: string;
}
export class CountryDetails {
    Country: string;
    CountryCode: string;
}
export class CBPFieldMaster extends CommonClass {
    ID: number;
    field: string;
    fieldName: string;
    text: string;
    defaultValue: string;
    mandatory: boolean;
    invisible: boolean;
}

export class GSTFields {
    code:string;
    description:string;
    isMandatory:boolean;
}
export class CBPIdentityFieldMaster extends CommonClass {

    ID: number;
    type: string;
    text: string;
    regexFormat: string;
    mandatory: boolean;
    fileFormat: string;
    maxSizeInKB: number;
}

// export interface CBPIdentity extends CommonClass {
    
// }