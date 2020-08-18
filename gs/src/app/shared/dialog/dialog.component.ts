import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from './dialog.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  name: string;
  payLoads: any;
  sourceTrxId: string;
  globaTrxId: string;
  intDetailsId: string;
  resubmitFlag: string;
  updatedUserId: string;
  integrationCode: string;
  updatedPayload: string;
  payloadUpdate: FormGroup;
  updateButton: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    public dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.name = data;
    this.integrationCode = data.INTEGRATION_CODE;
    this.sourceTrxId = data.SOURCE_TRX_ID;
    this.globaTrxId = data.GLOBAL_TRX_ID;
    this.intDetailsId = data.INT_DTLS_ID;
    this.payLoads = data.PAYLOAD;
    this.resubmitFlag = 'N';
    this.updatedUserId = 'Amit';
    this.updateButton = data.ERROR_TYPE.toUpperCase();
    console.log(data.PAYLOAD);
    this.payLoads = data.PAYLOAD;
    console.log(data.ERROR_TYPE);

  }

  ngOnInit(): void {
    this.payloadUpdate = new FormGroup({
      payLoads: new FormControl()
    });
  }

  updatePayload() {
    this.payLoads = this.payloadUpdate.get('payLoads').value;
    console.log(this.payLoads);
    console.log(this.globaTrxId);
    this.dialogService.updatePayload(this.integrationCode, this.globaTrxId, this.sourceTrxId, this.intDetailsId, this.payLoads, this.resubmitFlag, this.updatedUserId).subscribe((data => {
      console.log(data);
      return data;
    }))
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
