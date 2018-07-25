import {Component, Input, OnInit} from '@angular/core';
import {Employee} from '../../models/employee';
import {Position} from '../../models/position';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CrudWindowComponent} from '../../components/crud-window/crud-window.component';
import {ConfirmationBoxComponent} from '../../components/confirmation-box/confirmation-box.component';
import {Schedule} from '../../models/schedule';
import {UploadWindowComponent} from '../../components/upload-window/upload-window.component';
import {ExportSchedulesWindowComponent} from '../../components/export-schedules-window/export-schedules-window.component';


@Component({
    selector: 'app-model-list-view',
    templateUrl: './model-list-view.component.html',
    styleUrls: ['./model-list-view.component.css']
})
export class ModelListViewComponent implements OnInit {

    objectList: any;
    bulkActions: boolean;
    @Input() modelName: string;

    constructor(private matDialog: MatDialog, private snackBar: MatSnackBar, private matSnackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.bulkActions = false;
        this.objectList = [];
        this.getObjectList();
    }

    public getObjectList() {
        switch (this.modelName) {
            case 'employee':
                new Employee().findAll()
                    .then(data => {
                        this.objectList = data.rows;
                    });
                break;
            case 'position':
                new Position().findAll()
                    .then(data => {
                        this.objectList = data.rows;
                    });
                break;
            case 'schedule':
                new Schedule().findAll()
                    .then(data => {
                        let publicSchedules = [];
                        for (let schedule of data.rows) {
                            if (!schedule.doc.is_private) {
                                publicSchedules.push(schedule);
                            }
                        }
                        this.objectList = publicSchedules;
                    });
                break;
            default:
        }

    }

    public showAddObjectModal() {
        let dialogRef = this.matDialog.open(CrudWindowComponent, {
            width: '310px',
            height: 'auto',
            data: {
                modelName: this.modelName
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data && data.data._id) {
                this.getObjectList();
                this.snackBar.open('Naujas įrašas pridėtas sėkmingai!', 'OK', {duration: 3000, verticalPosition: 'top'});
            }
        });
    }

    public openUploadWindow() {
        let dialogRef = this.matDialog.open(UploadWindowComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.snackBar.open('Tvarkaraštis sėkmingai importuotas', 'OK', {duration: 3000, verticalPosition: 'top'});
                this.getObjectList();
            }
        });
    }

    public purgeSchedules() {

        let dialogRef = this.matDialog.open(ConfirmationBoxComponent, {
            data: {
                message: 'Dėmesio! Ši operacija anuliuos visus tvarkaraščius. Ar norite testi?'
            }
        });
        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    new Schedule().findAll().then(scheduleList => {
                        let tempScheduleList = [];
                        scheduleList.rows.forEach(schedule => {
                            let tempSchedule = new Schedule();
                            tempSchedule.data = {
                                _id: schedule.id,
                                schedule_name: schedule.doc.schedule_name,
                                work_hours_cap: '',
                                is_private: schedule.doc.is_private,
                                work_days: []
                            };
                            tempSchedule.save();
                            schedule.doc = {
                                _id: schedule.id,
                                schedule_name: schedule.doc.schedule_name,
                                work_hours_cap: '',
                                is_private: schedule.doc.is_private,
                                work_days: []
                            };
                            if (!tempSchedule.data.is_private) {
                                tempScheduleList.push(schedule);
                            }
                        });
                        this.matSnackBar.open('Ketvirtis sekmingai pradėtas', 'OK', {duration: 3000});
                        this.objectList = tempScheduleList;
                    });
                }
            });

    }

    public openExportWindow() {
        let dialogRef = this.matDialog.open(ExportSchedulesWindowComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.snackBar.open('Eksportas sėkmingas', 'OK', {duration: 3000, verticalPosition: 'top'});
                this.getObjectList();
            }
        });
    }
}
