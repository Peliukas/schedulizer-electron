import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Holiday} from '../../models/holiday';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-calendar-free-day-settings',
    templateUrl: './calendar-free-day-settings.component.html',
    styleUrls: ['./calendar-free-day-settings.component.css']
})
export class CalendarFreeDaySettingsComponent implements OnInit {

    freeDayDateControl: FormGroup;
    holidayNameControl = new FormControl();
    holidayList: any[] = [];

    constructor(private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.getHolidays();
        this.freeDayDateControl = new FormGroup({
            'holiday_month': new FormControl(null, Validators.required),
            'holiday_day': new FormControl(null, Validators.required),
        });
    }

    public getHolidays() {
        let holidayRef = new Holiday();
        holidayRef.findAll()
            .then(data => {
                this.holidayList = data.rows;
                console.log(this.holidayList);
            });
    }

    public addHoliday() {
        console.log('free day date: ', this.freeDayDateControl);
        let holidayRef = new Holiday();
        if (this.freeDayDateControl.valid) {
            holidayRef.setValues({
                '_id': this.holidayNameControl.value,
                'holiday_day': this.freeDayDateControl.get('holiday_day').value,
                'holiday_month': this.freeDayDateControl.get('holiday_month').value,
            });
            holidayRef.save();
        }
        this.getHolidays();
    }

    public deleteHoliday(id: any) {
        let holidayRef = new Holiday();
        holidayRef.find(id)
            .then(data => {
                holidayRef.delete();
                for (let i = 0; i < this.holidayList.length; i++) {
                    if (data._id === this.holidayList[i].id) {
                        this.holidayList.splice(i, 1);
                    }
                }
                this.snackBar.open('Šventė ' + id + ' pašalinta', 'OK', {duration: 3000});
            });
    }

}
