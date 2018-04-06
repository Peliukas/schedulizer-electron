import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-add-break',
    templateUrl: './add-break.component.html',
    styleUrls: ['./add-break.component.css']
})
export class AddBreakComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<AddBreakComponent>) {
    }

    ngOnInit() {
    }

    public addBreak(start: any, end: any) {
        this.dialogRef.close({start: start, end: end});
    }

}
