import {Component, OnInit} from '@angular/core';
import {Schedule} from '../../models/schedule';
import {DomSanitizer} from '@angular/platform-browser';
import {UploadWindowComponent} from '../upload-window/upload-window.component';
import {MatDialogRef, MatListOption} from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-export-schedules-window',
    templateUrl: './export-schedules-window.component.html',
    styleUrls: ['./export-schedules-window.component.scss']
})
export class ExportSchedulesWindowComponent implements OnInit {

    scheduleList: any[];
    downloadJsonHref: any;
    deleteExported: boolean = false;
    scheduleSelectionListControl: FormControl = new FormControl();
    allSelected: boolean = false;

    constructor(private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ExportSchedulesWindowComponent>) {
    }

    ngOnInit() {
        let scheduleRef = new Schedule();
        scheduleRef.findAll().then(scheduleList => {
            this.scheduleList = scheduleList.rows;
        });
    }

    generateDownloadJsonUri(selectedOptions: MatListOption[]) {
        console.log(selectedOptions.selected);
        let selectedScheduleList = [];
        selectedOptions.selected.forEach(item => {
            selectedScheduleList.push(item.value.doc);
        });
        if (selectedScheduleList.length > 0) {
            var theJSON = JSON.stringify(selectedScheduleList);
            var uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
            this.downloadJsonHref = uri;
        }
    }

    public downloadFile(selectedOptions: any) {
        if (this.deleteExported) {
            selectedOptions.selected.forEach(item => {
                let temp = new Schedule();
                temp.data = item.value.doc;
                temp.delete();
            });
        }
    }

}
