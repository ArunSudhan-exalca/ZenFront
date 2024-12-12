import { Guid } from 'guid-typescript';

export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class AttachmentDetails {
    FileName: string;
    blob: Blob;
}
export class FileDetails{
    FileName:string;
    FileContent:string;
    FileType:string;
}

