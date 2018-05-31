import PouchDB from 'pouchdb';
import {Configurations} from './configurations';
import {Holiday} from './holiday';
import {start} from 'repl';

export class Schedule {

    data: any;
    db: any;

    constructor() {
        this.data = {
            _id: '',
            schedule_name: '',
            work_hours_cap: '',
            is_private: false,
            work_days: []
        };
        this.db = new PouchDB('Schedules');
    }

    public setValues(data: any) {
        this.data._id = data._id;
        this.data.schedule_name = data.schedule_name;
        this.data.work_days = data.work_days;
        this.data.is_private = data.is_private;
        this.data.work_hours_cap = data.work_hours_cap;
    }

    public save() {
        try {
            this.db.get(this.data._id).then(doc => {
                this.data._rev = doc._rev;
                this.db.put(this.data);
            }, cause => {
                console.log('cause: ', cause);
                if (cause.status === 404 || cause.status === 409) {
                    this.db.put(this.data);
                }
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public delete() {
        this.db.get(this.data._id).then(doc => {
            doc._deleted = true;
            return this.db.put(doc);
        }, reason => {
            return reason;
        });
    }

    public async find(id: any) {
        this.db.get(id)
            .then(schedule => {
                this.data = schedule;
            }, reason => {

            });
        return this.db.get(id);
    }

    public findAll() {
        return this.db.allDocs(({include_docs: true}));
    }


    public getTotalWorkingHours() {
        let totalHours = 0;
        for (let workDay of this.data.work_days) {
            let startDateTime = new Date(workDay.date);
            let endDateTime = new Date(workDay.date);
            startDateTime.setHours(workDay.start_time.substr(0, 2));
            startDateTime.setMinutes(workDay.start_time.substr(3, 2));
            endDateTime.setHours(workDay.end_time.substr(0, 2));
            endDateTime.setMinutes(workDay.end_time.substr(3, 2));
            totalHours += Math.abs(startDateTime.getTime() - endDateTime.getTime()) - this.getBreaksPerMonth(new Date(workDay.date).getMonth());
        }
        totalHours = totalHours / 36e5;
        return totalHours - this.getTotalBreaks();
    }


    public getBreaksPerMonth(month: number) {
        let totalBreaks = 0;
        for (let workDay of this.data.work_days) {
            if (new Date(workDay.date).getMonth() === month) {
                for (let workDayBreak of workDay) {
                    let startDateTime = new Date(workDay.date);
                    let endDateTime = new Date(workDay.date);
                    startDateTime.setHours(workDayBreak.start.substr(0, 2));
                    startDateTime.setMinutes(workDayBreak.start.substr(3, 2));
                    endDateTime.setHours(workDayBreak.end.substr(0, 2));
                    endDateTime.setMinutes(workDayBreak.end.substr(3, 2));
                    totalBreaks += Math.abs(startDateTime.getTime() - endDateTime.getTime());
                }
            }
        }
        totalBreaks = totalBreaks / 36e5;
        return totalBreaks;
    }

    public getTotalBreaks() {
        let totalBreaks = 0;
        for (let workDay of this.data.work_days) {
            for (let workDayBreak of workDay.breaks) {
                let startDateTime = new Date(workDay.date);
                let endDateTime = new Date(workDay.date);
                startDateTime.setHours(workDayBreak.start.substr(0, 2));
                startDateTime.setMinutes(workDayBreak.start.substr(3, 2));
                endDateTime.setHours(workDayBreak.end.substr(0, 2));
                endDateTime.setMinutes(workDayBreak.end.substr(3, 2));
                totalBreaks += Math.abs(startDateTime.getTime() - endDateTime.getTime());
            }
        }
        totalBreaks = totalBreaks / 36e5;
        return totalBreaks;
    }

    public getWorkingHoursByDay(workDay: any) {
        return new Configurations().find('multipliers').then(configuration => {
            let totalNightTimeHours = 0;
            let ordinaryWorkHours = 0;
            let totalHolidayWorkHours = 0;
            if (workDay.start_time && workDay.end_time) {
                let startDateTime = new Date(workDay.date);
                let endDateTime = new Date(workDay.date);
                startDateTime.setHours(workDay.start_time.substr(0, 2));
                startDateTime.setMinutes(workDay.start_time.substr(3, 2));
                endDateTime.setHours(workDay.end_time.substr(0, 2));
                endDateTime.setMinutes(workDay.end_time.substr(3, 2));
                if (startDateTime.getHours() > endDateTime.getHours()) {
                    endDateTime.setDate(startDateTime.getDate() + 1);
                }
                let currentHour = startDateTime;
                if (currentHour.getMinutes() > 0) {
                    if (currentHour.getHours() < parseInt(configuration.night_time_start.substr(0, 2)) ||
                        currentHour.getHours() >= parseInt(configuration.night_time_end.substr(0, 2))) {
                        ordinaryWorkHours -= currentHour.getMinutes() / 60;
                    } else if (currentHour.getHours() >= parseInt(configuration.night_time_start.substr(0, 2)) ||
                        currentHour.getHours() < parseInt(configuration.night_time_end.substr(0, 2))) {
                        totalNightTimeHours -= currentHour.getMinutes() / 60;
                    }
                }
                return new Holiday().findAll().then(holidayList => {
                    while (currentHour <= endDateTime) {
                        //ordinary hours
                        if ((currentHour.getHours() < parseInt(configuration.night_time_start.substr(0, 2)) &&
                            currentHour.getHours() >= parseInt(configuration.night_time_end.substr(0, 2)))) {
                            //last hour check for minutes
                            if (currentHour.getHours() === endDateTime.getHours()) {
                                if (endDateTime.getMinutes() > 0) {
                                    ordinaryWorkHours += endDateTime.getMinutes() / 60;
                                }
                            } else {
                                ordinaryWorkHours += 1;
                            }
                        }
                        //night hours
                        else if (currentHour.getHours() >= parseInt(configuration.night_time_start.substr(0, 2)) ||
                            currentHour.getHours() < parseInt(configuration.night_time_end.substr(0, 2))) {
                            //last hour check for minutes
                            if ((currentHour.getHours() === endDateTime.getHours())) {
                                if (endDateTime.getMinutes() > 0) {
                                    totalNightTimeHours += endDateTime.getMinutes() / 60;
                                }
                            } else {
                                totalNightTimeHours += 1;
                            }
                        }
                        holidayList.rows.forEach(holiday => {
                            if (currentHour.getMonth() === holiday.doc.holiday_month - 1 && currentHour.getDate() === holiday.doc.holiday_day) {
                                if (currentHour.getMinutes() > 0) {
                                    totalHolidayWorkHours += currentHour.getMinutes() / 60;
                                } else if ((currentHour.getHours() === endDateTime.getHours() && endDateTime.getMinutes() > 0)) {
                                    totalHolidayWorkHours += endDateTime.getMinutes() / 60;
                                } else {
                                    totalHolidayWorkHours += 1;
                                }
                            }
                        });
                        currentHour.setHours(currentHour.getHours() + 1);
                    }
                    if (workDay.breaks) {
                        for (let workDayBreak of workDay.breaks) {
                            let breakStartTime = new Date(workDay.date);
                            let breakEndTime = new Date(workDay.date);
                            breakStartTime.setHours(workDayBreak.start.substr(0, 2));
                            breakStartTime.setMinutes(workDayBreak.start.substr(3, 2));
                            breakEndTime.setHours(workDayBreak.end.substr(0, 2));
                            breakEndTime.setMinutes(workDayBreak.end.substr(3, 2));
                            let breakTimeInHours = Math.abs((breakStartTime.getTime() - breakEndTime.getTime()) / 36e5);
                            if ((breakStartTime.getHours() >= parseInt(configuration.night_time_start.substr(0, 2)) &&
                                breakEndTime.getHours() <= parseInt(configuration.night_time_end.substr(0, 2))) ||
                                (breakStartTime.getHours() <= parseInt(configuration.night_time_start.substr(0, 2)) &&
                                    breakEndTime.getHours() >= parseInt(configuration.night_time_end.substr(0, 2)))) {
                                ordinaryWorkHours -= breakTimeInHours;
                            } else {
                                totalNightTimeHours -= breakTimeInHours;
                            }
                        }
                    }
                    const workHourSet = {
                        'ordinary_hours': ordinaryWorkHours,
                        'night_hours': totalNightTimeHours,
                        'holiday_hours': totalHolidayWorkHours
                    };
                    return workHourSet;
                });
            } else return false;
        });
    }

    public async getGroupedWorkDays() {
        let groupedWorkDays = [];
        if (this.data.work_days && this.data.work_days.length > 0) {
            for (let workDay of this.data.work_days) {
                let workDayYear = new Date(workDay.date).getFullYear();
                let workDayMonth = new Date(workDay.date).getMonth();
                if (workDay && workDay.start_time) {
                    if (groupedWorkDays[workDayYear]) {
                        if (groupedWorkDays[workDayYear][workDayMonth]) {
                            this.getWorkingHoursByDay(workDay).then(workDayWorkHours => {
                                workDay.work_hours = workDayWorkHours;
                                groupedWorkDays[workDayYear][workDayMonth].work_days.push(workDay);
                                groupedWorkDays[workDayYear][workDayMonth].work_hours['ordinary_hours'] += workDayWorkHours ? workDayWorkHours.ordinary_hours : 0;
                                groupedWorkDays[workDayYear][workDayMonth].work_hours['night_hours'] += workDayWorkHours ? workDayWorkHours.night_hours : 0;
                                groupedWorkDays[workDayYear][workDayMonth].work_hours['holiday_hours'] += workDayWorkHours ? workDayWorkHours.holiday_hours : 0;
                            });
                        } else {
                            groupedWorkDays[workDayYear][workDayMonth] = [];
                            groupedWorkDays[workDayYear][workDayMonth].work_days = [];
                            this.getWorkingHoursByDay(workDay).then(workDayWorkHours => {
                                workDay.work_hours = workDayWorkHours;
                                groupedWorkDays[workDayYear][workDayMonth].work_days.push(workDay);
                                groupedWorkDays[workDayYear][workDayMonth].work_hours = {
                                    ordinary_hours: workDayWorkHours ? workDayWorkHours.ordinary_hours : 0,
                                    night_hours: workDayWorkHours ? workDayWorkHours.night_hours : 0,
                                    holiday_hours: workDayWorkHours ? workDayWorkHours.holiday_hours : 0
                                };
                            });
                        }
                    } else {
                        groupedWorkDays[workDayYear] = [];
                        groupedWorkDays[workDayYear][workDayMonth] = [];
                        groupedWorkDays[workDayYear][workDayMonth].work_days = [];
                        this.getWorkingHoursByDay(workDay).then(workDayWorkHours => {
                            workDay.work_hours = workDayWorkHours;
                            groupedWorkDays[workDayYear][workDayMonth].work_days.push(workDay);
                            groupedWorkDays[workDayYear][workDayMonth].work_hours = {
                                ordinary_hours: workDayWorkHours ? workDayWorkHours.ordinary_hours : 0,
                                night_hours: workDayWorkHours ? workDayWorkHours.night_hours : 0,
                                holiday_hours: workDayWorkHours ? workDayWorkHours.holiday_hours : 0
                            };
                        });
                    }
                }
            }
        }
        return groupedWorkDays;
    }

}
