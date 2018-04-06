import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';


@Component({
    selector: 'app-confirmation-box',
    templateUrl: './confirmation-box.component.html',
    styleUrls: ['./confirmation-box.component.css']
})
export class ConfirmationBoxComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<ConfirmationBoxComponent>) {
    }

    ngOnInit() {
    }

    public closeWithChoice(choice: any) {
        this.dialogRef.close(choice === 'yes' ? true : false);
    }


}
