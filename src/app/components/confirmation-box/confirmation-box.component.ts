import {Component, OnInit, Input, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
    selector: 'app-confirmation-box',
    templateUrl: './confirmation-box.component.html',
    styleUrls: ['./confirmation-box.component.css']
})


export class ConfirmationBoxComponent implements OnInit {

    message: String;

    constructor(private dialogRef: MatDialogRef<ConfirmationBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data.message) {
            this.message = data.message;
        }
    }

    ngOnInit() {
    }

    public closeWithChoice(choice: any) {
        this.dialogRef.close(choice === 'yes' ? true : false);
    }


}
