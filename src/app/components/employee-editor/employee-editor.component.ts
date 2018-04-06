import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Schedule} from '../../models/schedule';
import {Employee} from '../../models/employee';
import {Position} from '../../models/position';
import {ConfirmationBoxComponent} from '../confirmation-box/confirmation-box.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CalendarWrapperComponent} from '../calendar-wrapper/calendar-wrapper.component';

@Component({
    selector: 'app-employee-editor',
    templateUrl: './employee-editor.component.html',
    styleUrls: ['./employee-editor.component.css']
})
export class EmployeeEditorComponent implements OnInit {

    @Input() employee: any;
    @Input() bulkActions: any;
    @Output() onEmployeeDeleted: EventEmitter<any> = new EventEmitter();
    scheduleList: any = '';
    positionList: any = '';

    positionRef: Position = new Position();
    scheduleRef: Schedule = new Schedule();

    constructor(private matDialog: MatDialog, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.getPositionList();
        this.getScheduleList();
    }


    public deleteSelectedEmployee(id: any) {
        let employee = new Employee();
        employee.find(id)
            .then(data => {
                employee.setValues(data);
                let dialogRef = this.matDialog.open(ConfirmationBoxComponent);
                dialogRef.afterClosed()
                    .subscribe(answer => {
                        if (answer === true) {
                            employee.delete();
                            this.onEmployeeDeleted.emit(employee.data);
                            this.snackBar.open('Darbuotojas pašalintas', 'OK', {duration: 3000});
                        }
                    });
            });
    }

    public getScheduleList() {
        new Schedule().findAll()
            .then(data => {
                let publicSchedules = [];
                for (let schedule of data.rows) {
                    if (!schedule.doc.is_private) {
                        publicSchedules.push(schedule);
                    }
                    if (schedule.doc.is_private && schedule.id === this.employee.id) {
                        publicSchedules.push(schedule);
                    }
                }
                console.log(publicSchedules);
                this.scheduleList = publicSchedules;
            });

    }

    public saveChanges(changes: any) {
        let employee = new Employee();
        employee.find(changes._id).then(data => {
            employee.data = changes;
            employee.save() === true ?
                this.snackBar.open('Pakeitimai išsaugoti', 'OK', {duration: 3000}) :
                this.snackBar.open('Nepavyko išsaugoti', 'OK', {duration: 3000});
        });
    }

    public getPositionList() {
        this.positionRef.findAll()
            .then(data => {
                this.positionList = data.rows;
            });
    }

    public openCalendarWindow() {
        new Schedule().find(this.employee.id)
            .then(schedule => {
                console.log('Schedule passed: ', schedule);
                let tempSchedule = {
                    doc: schedule,
                    id: schedule._id,
                    rev: schedule.rev,
                };
                let dialogRef = this.matDialog.open(CalendarWrapperComponent, {
                    height: '95vh',
                    width: '80vw',
                    data: {schedule: tempSchedule}
                });

            });
    }


}
