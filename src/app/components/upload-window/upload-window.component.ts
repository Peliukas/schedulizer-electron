import {Component, OnInit, Inject} from '@angular/core';
import {Schedule} from '../../models/schedule';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-upload-window',
    templateUrl: './upload-window.component.html',
    styleUrls: ['./upload-window.component.scss']
})
export class UploadWindowComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<UploadWindowComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    public fileUploaded(event: any) {
        let fileReader = new FileReader();
        fileReader.readAsText(event.srcElement.files[0]);
        fileReader.onload = function () {
            var dataURL = fileReader.result;
            let parsedData = JSON.parse(dataURL);
            parsedData.forEach(item => {
                let scheduleRef = new Schedule();
                scheduleRef.data = {
                    _id: item._id,
                    schedule_name: item.schedule_name,
                    work_days: item.work_days,
                    is_private: item.is_private,
                    work_hours_cap: item.work_hours_cap,
                };
                scheduleRef.save();
            });
        };
        this.dialogRef.close(true);
    }
}
