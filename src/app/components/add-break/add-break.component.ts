import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-break',
    templateUrl: './add-break.component.html',
    styleUrls: ['./add-break.component.css']
})
export class AddBreakComponent implements OnInit {

    breakList: any[] = [];
    start: FormControl = new FormControl();
    end: FormControl = new FormControl();
    presetTimeSelection: boolean = true;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<AddBreakComponent>) {
    }

    ngOnInit() {
    }

    public addBreak() {
        if (this.start.value && this.end.value) {
            this.breakList.push({start: this.start.value, end: this.end.value});
            this.start.reset('start');
            this.end.reset('end');
        }
    }

    public closeWithBreakList() {
        this.dialogRef.close(this.breakList);
    }

}
