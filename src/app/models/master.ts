
import { Guid } from 'guid-typescript';
export class UserWithRole {
    userID: Guid;
    roleID: Guid;
    userName: string;
    email: string;
    lastName:string;
    password: string;
    contactNumber: string;
    isActive: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
    role:string
}
export class UserView {
    UserID: Guid;
    UserName: string;
}
export class RoleWithApp {
    RoleID: Guid;
    RoleName: string;
    AppIDList: number[];
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class MenuApp {
    AppID: number;
    AppName: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class Reason {
    ReasonID: number;
    Description: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class AuthenticationDetails {
    IsAuth: boolean;
    userID: Guid;
    userName: string;
    DisplayName: string;
    emailAddress: string;
    userRole: string;
    Token: string;
    menuItemNames: string;
    Profile: string;
    RefreahToken: string;
    Expires: string;
    Issued: string;
    Expiresin: string;
}
export class ResetPasswordModel
{
    OldPassword : string;
    NewPassword : string;
    MailID:String
}
export class ChangePassword {
   
    UserName: string;
    CurrentPassword: string;
    NewPassword: string;
}
export class LoginModel {
    UserName: string;
    Password: string;
    clientId: string;
}
export class VendorLoginModel{
    UserId: string;
    Password: string;
}
export class EMailModel {
   
    UserName: string;
    siteURL: string;
}
export class ForgotPassword {
    UserID: Guid;
    EmailAddress: string;
    NewPassword: string;
    Token: string;
}
export class UserNotification {
    ID: number;
    UserID: string;
    Message: string;
    HasSeen: boolean;
    CreatedOn: Date;
    ModifiedOn?: Date;
}
export class VendorUser {
    Email: string;
    Phone: string;
}

export class SessionMaster {
    ID: number;
    ProjectName: string;
    SessionTimeOut: number;
    IsActive: boolean;
    CreatedOn: Date | string;
    CreatedBy: string;
    ModifiedOn: Date | string | null;
    ModifiedBy: string;
}

