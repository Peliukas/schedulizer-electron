import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {Employee} from '../../models/employee';
import {Position} from '../../models/position';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {Schedule} from '../../models/schedule';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';

@Component({
    selector: 'app-crud-window',
    templateUrl: './crud-window.component.html',
    styleUrls: ['./crud-window.component.css']
})
export class CrudWindowComponent implements OnInit {

    positionControl: FormControl = new FormControl();
    scheduleControl: FormControl = new FormControl();
    employeeFormControlGroup: FormGroup;
    positionFormControlGroup: FormGroup;
    scheduleFormControlGroup: FormGroup;
    privateSchedule = false;
    positionList: any[] = [];
    scheduleList: any[] = [];
    scheduleRef: any;


    modelName: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private  dialogRef: MatDialogRef<CrudWindowComponent>, private snackBar: MatSnackBar, private http: Http) {
    }

    ngOnInit() {
        this.modelName = this.data.modelName;
        switch (this.modelName) {
            case 'employee':
                let employeeFormControls = {
                    '_id': new FormControl(''),
                    'firstname': new FormControl('', [Validators.required]),
                    'lastname': new FormControl('', [Validators.required]),
                    'position_id': new FormControl(''),
                    'schedule_id': new FormControl(''),
                };
                this.employeeFormControlGroup = new FormGroup(employeeFormControls);
                this.getDropdownData();
                break;
            case 'position':
                let positionFormControls = {
                    '_id': new FormControl(''),
                    'job_title': new FormControl('', [Validators.required]),
                    'pay': new FormControl('', [Validators.required]),
                };
                this.positionFormControlGroup = new FormGroup(positionFormControls);
                break;
            case 'schedule':
                let scheduleFromControls = {
                    '_id': new FormControl(''),
                    'schedule_name': new FormControl('', [Validators.required]),
                    'work_days': new FormControl(''),
                    'is_private': new FormControl(''),
                    'work_hours_cap': new FormControl('', [Validators.required]),
                };
                this.scheduleFormControlGroup = new FormGroup(scheduleFromControls);
                break;
            default:
                break;
        }
    }

    public addObject() {
        switch (this.modelName) {
            case 'employee':
                this.employeeFormControlGroup.get('_id').setValue(this.employeeFormControlGroup.get('firstname').value + '-' + this.employeeFormControlGroup.get('lastname').value);
                if (this.positionControl.value) {
                    this.employeeFormControlGroup.get('position_id').setValue(this.positionControl.value);
                }
                if (this.scheduleControl.value) {
                    if (!this.privateSchedule) {
                        this.employeeFormControlGroup.get('schedule_id').setValue(this.scheduleControl.value);
                        console.log('public schedule: ', this.scheduleControl.value);
                    } else {
                        let schedule = new Schedule();
                        schedule.data._id = this.employeeFormControlGroup.get('firstname').value + '-' + this.employeeFormControlGroup.get('lastname').value;
                        schedule.data.work_hours_cap = 0;
                        schedule.data.is_private = true;
                        schedule.save();
                        this.employeeFormControlGroup.get('schedule_id').setValue(schedule.data._id);
                        console.log('private schedule: ', schedule);
                    }
                } else {
                    let schedule = new Schedule();
                    schedule.data._id = this.employeeFormControlGroup.get('firstname').value + '-' + this.employeeFormControlGroup.get('lastname').value;
                    schedule.data.work_hours_cap = 0;
                    schedule.data.is_private = true;
                    schedule.save();
                    this.employeeFormControlGroup.get('schedule_id').setValue(schedule.data._id);
                    console.log('private schedule: ', schedule);
                }
                if (this.employeeFormControlGroup.valid) {
                    let employee = new Employee();
                    employee.setValues(this.employeeFormControlGroup.value);
                    employee.save();
                    this.dialogRef.close(employee);
                } else {
                    this.snackBar.open('Užpildykite visus reikiamus laukus', 'OK', {duration: 3000});
                }
                break;
            case 'position':
                this.positionFormControlGroup.get('_id').setValue(this.positionFormControlGroup.get('job_title').value);
                let position = new Position();
                position.setValues(this.positionFormControlGroup.value);
                position.save();
                this.dialogRef.close(position);
                break;
            case 'schedule':
                this.scheduleFormControlGroup.get('_id').setValue(this.scheduleFormControlGroup.get('schedule_name').value);
                let schedule = new Schedule();
                schedule.setValues(this.scheduleFormControlGroup.value);
                schedule.save();
                this.dialogRef.close(schedule);
                break;
            default:
                break;
        }
    }


    private getDropdownData() {
        let positionRef = new Position();
        let scheduleRef = new Schedule();
        positionRef.findAll()
            .then(data => {
                this.positionList = data.rows;
            });
        scheduleRef.findAll()
            .then(data => {
                this.scheduleList = data.rows.filter(schedule => {
                    if (!schedule.doc.is_private) {
                        return schedule;
                    }
                });
            });
    }

    public fileUploaded(event: any) {
        console.log(event.srcElement.files[0]);
        let fileReader = new FileReader();
        fileReader.readAsText(event.srcElement.files[0]);
        fileReader.onload = function () {
            var dataURL = fileReader.result;
            let scheduleRef = new Schedule();
            let parsedData = JSON.parse(dataURL);
            scheduleRef.data = {
                _id: parsedData.doc._id,
                schedule_name: parsedData.doc.schedule_name,
                work_days: parsedData.doc.work_days,
                is_private: parsedData.doc.is_private,
                work_hours_cap: parsedData.doc.work_hours_cap,
            };
            console.log('saving schedule: ', parsedData);
            scheduleRef.save();
        };
        this.snackBar.open('Tvarkaraštis sėkmingai importuotas', 'OK', {duration: 3000});
        // this.dialogRef.close();
    }


}
