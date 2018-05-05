import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Holiday} from '../../models/holiday';
import {MatSnackBar} from '@angular/material';
import {Configurations} from '../../models/configurations';

@Component({
    selector: 'app-calendar-free-day-settings',
    templateUrl: './calendar-free-day-settings.component.html',
    styleUrls: ['./calendar-free-day-settings.component.css']
})
export class CalendarFreeDaySettingsComponent implements OnInit {

    freeDayDateControl: FormGroup;
    configControl: FormGroup;
    holidayNameControl = new FormControl();
    holidayList: any[] = [];
    config: any[] = [];

    constructor(private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.configControl = new FormGroup({
            'night_time_start': new FormControl(null),
            'night_time_end': new FormControl(null),
            'night_time_rate': new FormControl(null),
            'holiday_rate': new FormControl(null)
        });
        this.getHolidays();
        this.freeDayDateControl = new FormGroup({
            'holiday_month': new FormControl(null, Validators.required),
            'holiday_day': new FormControl(null, Validators.required),
        });
        this.getConfig();

    }

    public getHolidays() {
        let holidayRef = new Holiday();
        holidayRef.findAll()
            .then(data => {
                this.holidayList = data.rows;
            });
    }

    public deleteConfig() {
        new Configurations().find('multipliers')
            .then(data => {
                let configRef = new Configurations();
                configRef.data = data;
                configRef.delete();
            });
    }

    public getConfig() {
        new Configurations().find('multipliers')
            .then(data => {
                this.configControl.get('night_time_start').setValue(data.night_time_start);
                this.configControl.get('night_time_end').setValue(data.night_time_end);
                this.configControl.get('night_time_rate').setValue(data.night_time_rate);
                this.configControl.get('holiday_rate').setValue(data.holiday_rate);
            }, reason => {
                const configsRef = new Configurations();
                configsRef.data._id = 'multipliers';
                configsRef.save();
                console.log(reason);
            });
    }

    public saveConfig() {
        new Configurations().find('multipliers')
            .then(configuration => {
                let configRef = new Configurations();
                configRef.data = this.configControl.value;
                configRef.data._rev = configuration._rev;
                configRef.data._id = 'multipliers';
                configRef.save();
                this.snackBar.open('Pakeitimai sėkmingai išsaugoti', 'OK', {duration: 3000});
            });

    }

    public addHoliday() {
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
