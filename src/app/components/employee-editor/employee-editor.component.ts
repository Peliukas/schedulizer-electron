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
    employeeWorkingHours: number = 0;
    employeeWorkingHoursPerMonth: any;
    scheduleList: any = '';
    positionList: any = '';


    positionRef: Position = new Position();
    scheduleRef: Schedule = new Schedule();

    constructor(private matDialog: MatDialog, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.getPositionList();
        this.getScheduleList();
        if (this.employee.doc.schedule_id) {
            this.changeSchedule(this.employee.doc.schedule_id);
        }
        if (this.employee.doc.position_id) {
            this.changePosition(this.employee.doc.position_id);
        }
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

    public changeSchedule(scheduleID: any) {
        this.scheduleRef.find(scheduleID)
            .then(schedule => {
                this.scheduleRef.data = {
                    _id: schedule.id,
                    work_days: schedule.work_days,
                    schedule_name: '',
                    work_hours_cap: schedule.work_hours_cap,
                    is_private: schedule.is_private,
                };
                this.employeeWorkingHours = this.scheduleRef.getTotalWorkingHours();
                this.employeeWorkingHoursPerMonth = this.scheduleRef.getGroupedWorkDays();
            });
    }

    public openCalendarWindow() {
        new Schedule().find(this.employee.doc.schedule_id)
            .then(schedule => {
                let tempSchedule = {
                    doc: schedule,
                    id: schedule._id,
                    rev: schedule.rev,
                };
                this.matDialog.open(CalendarWrapperComponent, {
                    height: '95vh',
                    width: '80vw',
                    data: {schedule: tempSchedule}
                });

            });
    }

    public changePosition(positionID: any) {
        this.positionRef.find(positionID)
            .then(position => {
                this.positionRef.data = {
                    _id: position._id,
                    job_title: position.job_title,
                    pay: position.pay
                };
            });
    }

}
