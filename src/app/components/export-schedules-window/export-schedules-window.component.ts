import {Component, OnInit} from '@angular/core';
import {Schedule} from '../../models/schedule';
import {DomSanitizer} from '@angular/platform-browser';
import {UploadWindowComponent} from '../upload-window/upload-window.component';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-export-schedules-window',
    templateUrl: './export-schedules-window.component.html',
    styleUrls: ['./export-schedules-window.component.scss']
})
export class ExportSchedulesWindowComponent implements OnInit {

    scheduleList: any[];
    downloadJsonHref: any;

    constructor(private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ExportSchedulesWindowComponent>) {
    }

    ngOnInit() {
        let scheduleRef = new Schedule();
        scheduleRef.findAll().then(scheduleList => {
            this.scheduleList = scheduleList.rows;
        });
    }

    generateDownloadJsonUri(selectedOptions: any) {
        let selectedScheduleList = [];
        selectedOptions.selected.forEach(item => {
            selectedScheduleList.push(item.value.doc);
            let temp = new Schedule();
            temp.data = item.value.doc;
            temp.delete();
        });
        if (selectedScheduleList.length > 0) {
            var theJSON = JSON.stringify(selectedScheduleList);
            var uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
            this.downloadJsonHref = uri;
        }
        this.dialogRef.close(true);
    }

}
