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
    breakFormGroup: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<AddBreakComponent>) {
    }

    ngOnInit() {
        if (this.data) {
            this.breakList = this.data;
        }
        this.breakFormGroup = new FormGroup({
            'start': new FormControl('', Validators.required),
            'end': new FormControl('', Validators.required),
        });
    }

    public addBreak() {
        if (this.breakFormGroup.valid) {
            this.breakList.push({start: this.breakFormGroup.get('start').value, end: this.breakFormGroup.get('end').value});
            this.breakFormGroup.reset('start');
            this.breakFormGroup.reset('end');
        }
    }

    public closeWithBreakList() {
        this.dialogRef.close(this.breakList);
    }

}
