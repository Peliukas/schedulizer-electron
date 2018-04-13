import {Component, OnInit} from '@angular/core';
import {Employee} from '../../models/employee';
import {Position} from '../../models/position';
import {FormControl} from '@angular/forms';
import {Schedule} from '../../models/schedule';
import {DocumentPreviewComponent} from '../../components/document-preview/document-preview.component';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-export-import-window',
    templateUrl: './export-import-window.component.html',
    styleUrls: ['./export-import-window.component.scss']
})
export class ExportImportWindowComponent implements OnInit {

    calendarDayNumbers: any = [];
    selectedEmployees: any = [];
    employeeList: any = [];
    calendarData: any = [];
    employeeSelectorControl: FormControl = new FormControl();

    constructor(private matDialog: MatDialog) {
    }

    ngOnInit() {
        this.getEmployeeList();
        for (let i = 1; i < 32; i++) {
            this.calendarDayNumbers.push(i);
        }
    }

    public savePDF() {
        let dialogRef = this.matDialog.open(DocumentPreviewComponent, {
            data: this.calendarData,
            width: '100vw',
            panelClass: 'doc-preview-window'
        });
    }

    public getEmployeeList() {
        let employeeRef = new Employee();
        employeeRef.findAll()
            .then(employeeList => {
                let result = [];
                for (let employee of employeeList.rows) {
                    if (employee.doc.position_id) {
                        new Position().find(employee.doc.position_id)
                            .then(employeePosition => {
                                employee.doc.position = employeePosition;
                                result.push(employee);
                            });
                    }
                }
                this.employeeList = result;
            });
    }

    public getDay(date: any) {
        return new Date(date).getDate();
    }


    public employeeSelectionChange() {
        this.selectedEmployees = this.employeeSelectorControl.value;
        this.generateCalendarData();
    }

    public generateCalendarData() {
        for (let employee of this.employeeList) {
            for (let selectedEmployee of this.selectedEmployees) {
                if (employee.id === selectedEmployee) {
                    new Schedule().find(employee.doc.schedule_id)
                        .then(employeeScheduleData => {
                            let employeeSchedule = new Schedule();
                            employeeSchedule.data = employeeScheduleData;
                            let employeeWorkDays = employeeSchedule.getGroupedWorkDays();
                            console.log('Emp. position', employee.doc.position);
                            let employeeFullName = employee.doc.firstname + '_' + employee.doc.lastname;
                            Object.keys(employeeWorkDays).forEach(year => {
                                if (employeeWorkDays[year] && employeeWorkDays[year].length > 0) {
                                    if (!this.calendarData['years']) {
                                        this.calendarData['years'] = [];
                                        this.calendarData['years'][year] = [];
                                        this.calendarData['years'][year].year = year;
                                        Object.keys(employeeWorkDays[year]).forEach(month => {
                                            if (employeeWorkDays[year][month] && employeeWorkDays[year][month].length > 0) {
                                                if (this.calendarData['years'][year]['months']) {
                                                    if (this.calendarData['years'][year]['months'][month]) {
                                                        if (this.calendarData['years'][year]['months'][month]['employees']) {
                                                            this.calendarData['years'][year]['months'][month]['employees'] = this.calendarData['years'][year]['months'][month]['employees'].filter(emp => emp.employee_id !== employeeFullName);
                                                            this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                employee_id: employeeFullName,
                                                                firstname: employee.doc.firstname,
                                                                lastname: employee.doc.lastname,
                                                                work_days: employeeWorkDays[year][month],
                                                                position: employee.doc.position,
                                                                month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                            });
                                                        } else {
                                                            this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                            this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                employee_id: employeeFullName,
                                                                firstname: employee.doc.firstname,
                                                                lastname: employee.doc.lastname,
                                                                work_days: employeeWorkDays[year][month],
                                                                position: employee.doc.position,
                                                                month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                            });
                                                        }
                                                    } else {
                                                        this.calendarData['years'][year]['months'][month] = [];
                                                        this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                        this.calendarData['years'][year]['months'][month].month = month;
                                                        this.calendarData['years'][year]['months'][month]['employees'].push({
                                                            employee_id: employeeFullName,
                                                            firstname: employee.doc.firstname,
                                                            lastname: employee.doc.lastname,
                                                            work_days: employeeWorkDays[year][month],
                                                            position: employee.doc.position,
                                                            month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                        });
                                                    }
                                                } else {
                                                    this.calendarData['years'][year]['months'] = [];
                                                    this.calendarData['years'][year]['months'][month] = [];
                                                    this.calendarData['years'][year]['months'][month].month = month;
                                                    this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                    this.calendarData['years'][year]['months'][month]['employees'].push({
                                                        employee_id: employeeFullName,
                                                        firstname: employee.doc.firstname,
                                                        lastname: employee.doc.lastname,
                                                        work_days: employeeWorkDays[year][month],
                                                        position: employee.doc.position,
                                                        month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        Object.keys(employeeWorkDays[year]).forEach(month => {
                                            if (employeeWorkDays[year][month] && employeeWorkDays[year][month].length > 0) {
                                                if (this.calendarData['years'][year]['months']) {
                                                    if (this.calendarData['years'][year]['months'][month]) {
                                                        if (this.calendarData['years'][year]['months'][month]['employees']) {
                                                            if (this.calendarData['years'][year]['months'][month]['employees']) {
                                                                this.calendarData['years'][year]['months'][month]['employees'] = this.calendarData['years'][year]['months'][month]['employees'].filter(emp => emp.employee_id !== employeeFullName);
                                                                this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                    employee_id: employeeFullName,
                                                                    firstname: employee.doc.firstname,
                                                                    lastname: employee.doc.lastname,
                                                                    work_days: employeeWorkDays[year][month],
                                                                    position: employee.doc.position,
                                                                    month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                                });
                                                            } else {
                                                                this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                                this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                    employee_id: employeeFullName,
                                                                    firstname: employee.doc.firstname,
                                                                    lastname: employee.doc.lastname,
                                                                    work_days: employeeWorkDays[year][month],
                                                                    position: employee.doc.position,
                                                                    month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                                });
                                                            }
                                                        } else {
                                                            this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                            this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                employee_id: employeeFullName,
                                                                firstname: employee.doc.firstname,
                                                                lastname: employee.doc.lastname,
                                                                work_days: employeeWorkDays[year][month],
                                                                position: employee.doc.position,
                                                                month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                            });

                                                        }
                                                    } else {
                                                        this.calendarData['years'][year]['months'][month] = [];
                                                        this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                        this.calendarData['years'][year]['months'][month].month = month;
                                                        this.calendarData['years'][year]['months'][month]['employees'].push({
                                                            employee_id: employeeFullName,
                                                            firstname: employee.doc.firstname,
                                                            lastname: employee.doc.lastname,
                                                            work_days: employeeWorkDays[year][month],
                                                            position: employee.doc.position,
                                                            month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                        });
                                                    }
                                                } else {
                                                    this.calendarData['years'][year]['months'] = [];
                                                    this.calendarData['years'][year]['months'][month] = [];
                                                    this.calendarData['years'][year]['months'][month].month = month;
                                                    this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                    this.calendarData['years'][year]['months'][month]['employees'].push({
                                                        employee_id: employeeFullName,
                                                        firstname: employee.doc.firstname,
                                                        lastname: employee.doc.lastname,
                                                        work_days: employeeWorkDays[year][month],
                                                        position: employee.doc.position,
                                                        month_salary: parseInt(employee.doc.position.pay) * employeeWorkDays[year][month].work_hours
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                            console.log(this.calendarData);
                        }, reason => {

                        });
                }
            }
        }
    }
}
