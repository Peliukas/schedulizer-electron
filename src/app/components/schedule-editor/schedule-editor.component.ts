import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog, MatSnackBar, MatChipList} from '@angular/material';
import {Schedule} from '../../models/schedule';
import {AddBreakComponent} from '../add-break/add-break.component';
import {ConfirmationBoxComponent} from '../confirmation-box/confirmation-box.component';
import {Subject} from 'rxjs/Subject';
import {Holiday} from '../../models/holiday';
import {PeriodTemplate} from '../../models/period-template';
import {saveAs} from 'file-saver';
import * as jsPDF from 'jspdf';
import {DocumentPreviewComponent} from '../document-preview/document-preview.component';


@Component({
    selector: 'app-schedule-editor',
    templateUrl: './schedule-editor.component.html',
    styleUrls: ['./schedule-editor.component.css']
})
export class ScheduleEditorComponent implements OnInit {

    @ViewChild('breakChips') chips: MatChipList;
    @Input() schedule: any;
    @Output() onScheduleDelete: EventEmitter<any> = new EventEmitter();
    viewDate: Date = new Date();
    breakList: any[] = [];
    weekDayList: any[] = [];
    periodTemplateList: any[] = [];
    selectedWorkDayList: any[] = [];
    calendarWorkDays: any[] = [];
    selectMultipleDays: boolean = false;
    isHoliday: boolean = false;
    weekDaySelectionMode: boolean = false;
    displayPeriodTemplateNameField = false;
    selectedCalendarDay: any = '';
    startTimeInputControl: FormControl;
    endTimeInputControl: FormControl;
    periodStartDateControl: FormControl;
    periodEndDateControl: FormControl;
    refresh: Subject<any> = new Subject();
    totalWorkingHours: number = 0;
    newPeriodTemplateName: any = '';

    constructor(private snackBar: MatSnackBar, private matDialog: MatDialog) {
    }

    ngOnInit() {
        this.getCalendarWorkDays();
        this.generateWeekDays();
        this.startTimeInputControl = new FormControl();
        this.endTimeInputControl = new FormControl();
        this.periodStartDateControl = new FormControl();
        this.periodEndDateControl = new FormControl();
        this.getPeriodTemplates();
        this.refresh.next();
    }

    public generateWeekDays() {
        this.weekDayList = [];
        this.weekDayList[0] = {
            weekDayName: 'Pir',
            weekDayNumber: 1,
            selected: false
        };
        this.weekDayList[1] = {
            weekDayName: 'Ant',
            weekDayNumber: 2,
            selected: false
        };
        this.weekDayList[2] = {
            weekDayName: 'Tre',
            weekDayNumber: 3,
            selected: false
        };
        this.weekDayList[3] = {
            weekDayName: 'Ket',
            weekDayNumber: 4,
            selected: false
        };
        this.weekDayList[4] = {
            weekDayName: 'Pen',
            weekDayNumber: 5,
            selected: false
        };
        this.weekDayList[5] = {
            weekDayName: 'Še',
            weekDayNumber: 6,
            selected: false
        };
        this.weekDayList[6] = {
            weekDayName: 'Se',
            weekDayNumber: 0,
            selected: false
        };
    }

    public deleteSelectedSchedule() {
        let scheduleRef = new Schedule();
        scheduleRef.find(this.schedule.doc._id)
            .then(data => {
                let dialogRef = this.matDialog.open(ConfirmationBoxComponent);
                dialogRef.afterClosed()
                    .subscribe(answer => {
                        if (answer === true) {
                            scheduleRef.delete();
                            this.onScheduleDelete.emit(scheduleRef.data);
                            this.snackBar.open('Tvarkaraštis ' + this.schedule.id + ' pašalintas', 'OK', {duration: 3000});
                        }
                    });
            });
    }


    public nextMonth() {
        this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + 1));
    }

    public previousMonth() {
        this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1));
    }

    public dayClicked(day: any) {
        if (this.selectMultipleDays) {
            this.addWorkDay(day);
        } else {
            if (day.events.length > 0) {
                this.setWorkDayInputFields(day);
                this.selectedCalendarDay = day;
            }
            else {
                this.resetSelection();
                this.selectedCalendarDay = day;
            }
        }
    }

    public addWorkDay(day: any) {
        if (this.selectedWorkDayList.length < 1) {
            this.selectedWorkDayList = [
                {
                    title: new Date(day.date),
                    color: '',
                    start: new Date(day.date),
                }
            ];
        } else {
            for (let workDay of this.selectedWorkDayList) {
                if (workDay.start.toDateString() === day.date.toDateString()) {
                    this.selectedWorkDayList.splice(this.selectedWorkDayList.indexOf(workDay), 1);
                    return false;
                }
            }
            this.selectedWorkDayList.push({
                title: new Date(day.date),
                color: '',
                start: new Date(day.date),
            });
            return true;
        }
    }

    public weekDayClicked(weekDay: any) {
        for (let i = 0; i < this.weekDayList.length; i++) {
            if (this.weekDayList[i].weekDayName === weekDay.weekDayName) {
                this.weekDayList[i].selected = !this.weekDayList[i].selected;
                this.weekDayList[i].start_time = this.startTimeInputControl.value;
                this.weekDayList[i].end_time = this.endTimeInputControl.value;
                break;
            }
        }
    }

    public weekDayTimeChange() {
        for (let i = 0; i < this.weekDayList.length; i++) {
            if (this.weekDayList[i].selected) {
                this.weekDayList[i].start_time = this.startTimeInputControl.value ? this.startTimeInputControl.value : '';
                this.weekDayList[i].end_time = this.endTimeInputControl.value ? this.endTimeInputControl.value : '';
            }
        }
    }

    public setPeriod() {
        let workPeriod = [];
        let periodStart = new Date(this.periodStartDateControl.value);
        let periodEnd = new Date(this.periodEndDateControl.value);
        console.log('weekday list: ', this.weekDayList);
        while (periodStart.toISOString() < periodEnd.toISOString()) {
            for (let weekDay of this.weekDayList) {
                if (periodStart.getDay() === weekDay.weekDayNumber && weekDay.selected) {
                    let tempPeriodWeekDay = {};
                    if (weekDay.start_time && weekDay.end_time) {
                        tempPeriodWeekDay = {
                            start_time: weekDay.start_time,
                            end_time: weekDay.end_time,
                            date: new Date(periodStart),
                            breaks: this.breakList,
                            isHoliday: this.isHoliday
                        };
                    } else {
                        tempPeriodWeekDay = {
                            start_time: this.startTimeInputControl.value,
                            end_time: this.endTimeInputControl.value,
                            date: new Date(periodStart),
                            breaks: this.breakList,
                            isHoliday: this.isHoliday
                        };
                    }
                    workPeriod.push(tempPeriodWeekDay);
                    periodStart.setDate(periodStart.getDate() + 1);
                }
            }
            periodStart.setDate(periodStart.getDate() + 1);
        }
        let scheduleRef = new Schedule();
        scheduleRef.setValues(this.schedule.doc);
        let tempWorkDayList = [];
        if (this.schedule.doc.work_days && this.schedule.doc.work_days[0] !== '') {
            for (let periodWorkDay of workPeriod) {
                let dayFound = false;
                for (let existingWorkDay of scheduleRef.data.work_days) {
                    if (new Date(existingWorkDay.date).toISOString() === new Date(periodWorkDay.date).toISOString()) {
                        dayFound = existingWorkDay;
                        for (let i = 0; i < scheduleRef.data.work_days.length; i++) {
                            if (new Date(scheduleRef.data.work_days[i].date).toISOString() === new Date(existingWorkDay.date).toISOString()) {
                                scheduleRef.data.work_days.splice(i, 1);
                                break;
                            }
                        }
                        break;
                    }
                }
                if (!dayFound) {
                    tempWorkDayList.push(periodWorkDay);
                } else {
                    tempWorkDayList.push(dayFound);
                }
            }
        } else {
            tempWorkDayList = workPeriod;
        }
        let combined = tempWorkDayList.concat(scheduleRef.data.work_days);
        this.schedule.doc.work_days = combined;
        scheduleRef.data.work_days = combined;
        scheduleRef.save();
        this.resetSelection();
        this.getCalendarWorkDays();
        this.refresh.next();
        this.snackBar.open('Terminas pridėtas', 'OK', {duration: 3000});
    }

    public saveScheduleChanges() {
        let scheduleRef = new Schedule();
        let tempWorkDayList = [];
        for (let selectedWorkDay of this.selectedWorkDayList) {
            tempWorkDayList.push({
                start_time: this.isHoliday ? '' : this.startTimeInputControl.value,
                end_time: this.isHoliday ? '' : this.endTimeInputControl.value,
                date: selectedWorkDay.start,
                breaks: this.isHoliday ? '' : this.breakList,
                isHoliday: this.isHoliday
            });
        }
        let uniqueWorkDays = [];
        for (let existingWorkDay of this.schedule.doc.work_days) {
            let detectedDay = null;
            for (let tempWorkDay of tempWorkDayList) {
                if (new Date(tempWorkDay.date).toDateString() === new Date(existingWorkDay.date).toDateString()) {
                    detectedDay = tempWorkDay;
                    tempWorkDayList.splice(tempWorkDayList.indexOf(tempWorkDay), 1);
                }
            }
            if (!detectedDay) {
                detectedDay = existingWorkDay;
            }
            uniqueWorkDays.push(detectedDay);
        }
        uniqueWorkDays = uniqueWorkDays.concat(tempWorkDayList);
        scheduleRef.setValues(this.schedule.doc);
        scheduleRef.setWorkDays(uniqueWorkDays);
        scheduleRef.save();
        this.snackBar.open('Pakeitimai išsaugoti', 'OK', {duration: 3000});
        this.schedule.doc = scheduleRef.data;
        this.resetSelection();
        this.getCalendarWorkDays();
        this.selectMultipleDays = false;
        this.refresh.next();
    }


    public saveWorkDayChanges() {
        let scheduleRef = new Schedule();
        scheduleRef.setValues(this.schedule.doc);
        let tempDay = {
            start_time: this.isHoliday ? '' : this.startTimeInputControl.value,
            end_time: this.isHoliday ? '' : this.endTimeInputControl.value,
            date: new Date(this.selectedCalendarDay.date),
            breaks: this.breakList,
            isHoliday: this.isHoliday
        };
        for (let i = 0; i < scheduleRef.data.work_days.length; i++) { //work day exists, set new values
            if (new Date(scheduleRef.data.work_days[i].date).getDate() === new Date(this.selectedCalendarDay.date).getDate()) {
                scheduleRef.data.work_days[i] = tempDay;
                scheduleRef.save();
                this.schedule.doc = scheduleRef.data;
                this.snackBar.open('Darbo diena išsaugota', 'OK', {duration: 3000});
                this.getCalendarWorkDays();
                this.refresh.next();
                return true;
            }
        }
        if (!this.schedule.doc.work_days) {
            this.schedule.doc.work_days = [tempDay]; //list empty, init new
        } else {
            this.schedule.doc.work_days.push(tempDay);//work day not found, pushing
        }
        scheduleRef.data.work_days = this.schedule.doc.work_days;
        scheduleRef.save();
        this.schedule.doc = scheduleRef.data;
        this.snackBar.open('Darbo diena išsaugota', 'OK', {duration: 3000});
        this.resetSelection();
        this.getCalendarWorkDays();
        this.refresh.next();
    }

    public unmarkDays() {
        this.selectedWorkDayList = [];
        this.selectMultipleDays = false;
    }

    public openAddBreakWindow() {
        let dialogRef = this.matDialog.open(AddBreakComponent);
        dialogRef.afterClosed()
            .subscribe(data => {
                if (data) {
                    this.breakList.push(data);
                    this.snackBar.open('Pertrauka pridėta', 'OK', {duration: 3000});
                }
            });
    }

    public setWorkDayInputFields(day: any) {
        for (let scheduleWorkDay of this.schedule.doc.work_days) {
            if (new Date(day.date).getDate() === new Date(scheduleWorkDay.date).getDate()) {
                if (scheduleWorkDay.isHoliday) {
                    this.startTimeInputControl.disable();
                    this.endTimeInputControl.disable();
                    this.resetSelection();
                    this.isHoliday = true;
                    this.selectedCalendarDay = day;
                } else {
                    this.startTimeInputControl.enable();
                    this.endTimeInputControl.enable();
                    this.startTimeInputControl.setValue(scheduleWorkDay.start_time);
                    this.endTimeInputControl.setValue(scheduleWorkDay.end_time);
                    this.breakList = scheduleWorkDay.breaks;
                    this.isHoliday = false;
                    this.selectedCalendarDay = day;
                }
            }
        }
    }

    public getCalendarWorkDays() {
        this.calendarWorkDays = [];
        let holidayRef = new Holiday().findAll()
            .then(holidayList => {
                for (let holiday of holidayList.rows) {
                    let startDate = new Date();
                    startDate.setMonth(holiday.doc.holiday_month);
                    startDate.setDate(holiday.doc.holiday_day);
                    this.calendarWorkDays.push({
                        title: holiday.id,
                        start: startDate,
                        color: 'holiday'
                    });
                }
                for (let workDay of this.schedule.doc.work_days) {
                    if (workDay.isHoliday) {
                        this.calendarWorkDays.push({
                            title: 'Išeiginė',
                            start: new Date(workDay.date),
                            color: 'day-off'
                        });
                    } else {
                        this.calendarWorkDays.push({
                            title: workDay.start_time + ' - ' + workDay.end_time,
                            start: new Date(workDay.date),
                            color: 'work-day'
                        });
                    }
                }
                this.getTotalWorkingHours();
                this.refresh.next();
            }, cause => {
                this.calendarWorkDays = [];
                for (let workDay of this.schedule.doc.work_days) {
                    if (workDay.isHoliday) {
                        this.calendarWorkDays.push({
                            title: 'Išeiginė',
                            start: new Date(workDay.date),
                            color: 'day-off'
                        });
                    } else {
                        this.calendarWorkDays.push({
                            title: workDay.start_time + ' - ' + workDay.end_time,
                            start: new Date(workDay.date),
                            color: 'work-day'
                        });
                    }
                }
                this.getTotalWorkingHours();
                this.refresh.next();
            });
    }

    public clearCells() {
        let scheduleRef = new Schedule();
        scheduleRef.setValues(this.schedule.doc);
        if (this.selectMultipleDays) {
            this.selectMultipleDays = false;
            for (let selectedWorkDay of this.selectedWorkDayList) {
                for (let workDay of scheduleRef.data.work_days) {
                    if (new Date(workDay.date).getDate() === new Date(selectedWorkDay.start).getDate()) {
                        scheduleRef.data.work_days.splice(scheduleRef.data.work_days.indexOf(workDay), 1);
                    }
                }
            }
            this.schedule.doc = scheduleRef.data;
            scheduleRef.save();
            this.resetSelection();
            this.getCalendarWorkDays();
            this.refresh.next();
            this.snackBar.open('Išvalyta', 'OK', {duration: 3000});
        } else {
            if (this.selectedCalendarDay.events) {
                for (let workDay of scheduleRef.data.work_days) {
                    if (new Date(workDay.date).toDateString() === new Date(this.selectedCalendarDay.date).toDateString()) {
                        scheduleRef.data.work_days.splice(scheduleRef.data.work_days.indexOf(workDay), 1);
                        scheduleRef.save();
                        this.snackBar.open('Išvalyta', 'OK', {duration: 3000});
                        this.resetSelection();
                        this.schedule.doc = scheduleRef.data;
                        this.getCalendarWorkDays();
                        this.refresh.next();
                    }
                }
            }
        }
    }

    public resetSelection() {
        this.selectedCalendarDay = '';
        this.endTimeInputControl.reset();
        this.endTimeInputControl.enable();
        this.startTimeInputControl.reset();
        this.startTimeInputControl.enable();
        this.periodStartDateControl.reset();
        this.periodEndDateControl.reset();
        this.selectedWorkDayList = [];
        this.breakList = [];
        this.isHoliday = false;
        for (let weekDay of this.weekDayList) {
            weekDay.start_time = null;
            weekDay.end_time = null;
            weekDay.selected = false;
        }
    }

    public deleteBreak(breakStart: any, breakEnd: any) {
        for (let tempBreak of this.breakList) {
            if (tempBreak.start === breakStart && tempBreak.end === breakEnd) {
                this.breakList.splice(this.breakList.indexOf(tempBreak), 1);
            }
        }
        for (let i = 0; i < this.schedule.doc.work_days.length; i++) {
            if (new Date(this.schedule.doc.work_days[i].date).toUTCString() === new Date(this.selectedCalendarDay.date).toUTCString()) {
                for (let j = 0; j < this.schedule.doc.work_days[i].breaks.length; j++) {
                    if (this.schedule.doc.work_days[i].breaks[j].start === breakStart && this.schedule.doc.work_days[i].breaks[j].end === breakEnd) {
                        this.schedule.doc.work_days[i].breaks.splice(j, 1);
                        this.snackBar.open('Pertrauka pašalinta', 'OK', {duration: 3000});
                    }
                }
            }
        }
    }

    public getTotalWorkingHours() {
        let totalHours = 0;
        for (let workDay of this.schedule.doc.work_days) {
            if (workDay.start_time && workDay.end_time) {
                let startDateTime = new Date(workDay.date);
                let endDateTime = new Date(workDay.date);
                startDateTime.setHours(workDay.start_time.substr(0, 2));
                startDateTime.setMinutes(workDay.start_time.substr(3, 2));
                endDateTime.setHours(workDay.end_time.substr(0, 2));
                endDateTime.setMinutes(workDay.end_time.substr(3, 2));
                totalHours += Math.abs(startDateTime.getTime() - endDateTime.getTime());
            }
        }
        this.totalWorkingHours = totalHours / 36e5;
    }

    public getPeriodTemplates() {
        new PeriodTemplate().findAll()
            .then(periodTemplateList => {
                this.periodTemplateList = periodTemplateList.rows;
            });

    }

    public createPeriodTemplate(newPeriodTemplateName: any) {
        let periodTemplateRef = new PeriodTemplate();
        periodTemplateRef.data = {
            _id: newPeriodTemplateName,
            start_date: this.periodStartDateControl.value,
            end_date: this.periodEndDateControl.value,
            breaks: this.breakList,
            week_days: this.weekDayList
        };
        periodTemplateRef.save();
        this.getPeriodTemplates();
        this.displayPeriodTemplateNameField = false;
        this.snackBar.open('Termino šablonas sėkmingai pridėtas', 'OK', {duration: 3000});
    }

    public applyPeriodTemplate(periodTemplateID: any) {
        if (periodTemplateID) {
            let periodTemplateRef = new PeriodTemplate();
            this.periodTemplateList.forEach(periodTemplate => {
                if (periodTemplateID === periodTemplate.id) {
                    periodTemplateRef.data = periodTemplate.doc;
                }
            });
            this.periodStartDateControl.setValue(periodTemplateRef.data.start_date);
            this.periodEndDateControl.setValue(periodTemplateRef.data.end_date);
            this.weekDayList = periodTemplateRef.data.week_days;
        } else {
            this.resetSelection();
        }
    }

    public removePeriodTemplate(periodTemplate: any) {
        let periodTemplateRef = new PeriodTemplate();
        new PeriodTemplate().find(periodTemplate.id)
            .then(periodTemplate => {
                periodTemplateRef.data._id = periodTemplate.doc._id;
                periodTemplateRef.delete();
                for (let period of this.periodTemplateList) {
                    if (period.id === periodTemplate.id) {
                        periodTemplate.splice(periodTemplate.indexOf(period), 1);
                        break;
                    }
                }
                this.snackBar.open('Termino šablonas sėkmingai pašalintas', 'OK', {duration: 3000});
            });
    }


    public storeSchedule() {
        var file = new File([JSON.stringify(this.schedule)], this.schedule.id + '.json', {type: 'text/plain;charset=utf-8'});
        saveAs(file);
    }


    public savePDF() {
        let dialogRef = this.matDialog.open(DocumentPreviewComponent, {
            data: this.schedule
        });
        // var doc = new jsPDF();
        // doc.text(20, 10, this.schedule.doc._id);
        // let counter = 2;
        // for(let workDay of this.schedule.doc.work_days){
        //     doc.text(20, counter*10, new Date(workDay.date).toDateString());
        //     doc.text(80, counter*10, workDay.start_time ? workDay.start_time : '');
        //     doc.text(110, counter*10, workDay.end_time ? workDay.end_time : '');
        //     if(counter < 30){
        //         counter++;
        //     }else{
        //         doc.addPage()
        //         counter = 1;
        //     }
        // }
        // doc.save(this.schedule.doc._id+'.pdf');


    }

}
