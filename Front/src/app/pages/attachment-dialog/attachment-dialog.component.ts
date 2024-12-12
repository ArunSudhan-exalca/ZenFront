import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { DialogData } from '../notification-dialog/dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileSaverService } from '../../service/file-saver.service';

@Component({
  selector: 'attachment-dialog',
  templateUrl: './attachment-dialog.component.html',
  styleUrls: ['./attachment-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class AttachmentDialogComponent implements OnInit {
  AttachmentData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AttachmentDialogComponent>,private _fileSaver: FileSaverService,
  ) { }

  ngOnInit(): void {
   this.getFile();
  }
  async getFile():Promise<void>{
  this.AttachmentData = await this._fileSaver.getAttachmentData(this.data);
  console.log("hello")
}
  // CloseClicked(): void {
  //   this.matDialogRef.close(null);
  // }
  // downloadFile(): void {
  //   console.log('download click')
  //   saveAs(this.attachmentDetails.blob, this.attachmentDetails.FileName);
  // }

}
