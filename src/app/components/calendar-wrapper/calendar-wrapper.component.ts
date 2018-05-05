import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScheduleEditorComponent} from '../schedule-editor/schedule-editor.component';

@Component({
    selector: 'app-calendar-wrapper',
    templateUrl: './calendar-wrapper.component.html',
    styleUrls: ['./calendar-wrapper.component.css']
})
export class CalendarWrapperComponent implements OnInit {

    schedule: any;

    constructor(public dialogRef: MatDialogRef<ScheduleEditorComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.schedule = this.data.schedule;
    }

}
