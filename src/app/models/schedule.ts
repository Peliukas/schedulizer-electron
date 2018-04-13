import PouchDB from 'pouchdb';

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
                if (cause.status === 404) {
                    this.db.put(this.data);
                }
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public setWorkDays(workDays: any) {
        this.data.work_days = workDays;
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
            totalHours += Math.abs(startDateTime.getTime() - endDateTime.getTime());
        }
        totalHours = totalHours / 36e5;
        return totalHours - this.getTotalBreaks();
    }

    public getWorkingHoursPerMonth(month: number) {
        let totalHours = 0;
        for (let workDay of this.data.work_days) {
            if (workDay.date.getMonth() === month) {
                let startDateTime = new Date(workDay.date);
                let endDateTime = new Date(workDay.date);
                startDateTime.setHours(workDay.start_time.substr(0, 2));
                startDateTime.setMinutes(workDay.start_time.substr(3, 2));
                endDateTime.setHours(workDay.end_time.substr(0, 2));
                endDateTime.setMinutes(workDay.end_time.substr(3, 2));
                totalHours += Math.abs(startDateTime.getTime() - endDateTime.getTime());
            }
        }

        totalHours = totalHours / 36e5;
        return totalHours - this.getBreaksPerMonth(month);
    }

    public getBreaksPerMonth(month: number) {
        let totalBreaks = 0;
        for (let workDay of this.data.work_days) {
            if (workDay.date.getMonth() === month) {
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

    public getBreaksByDay(workDay: any) {
        let totalBreaks = 0;
        for (let workDayBreak of workDay.breaks) {
            let startDateTime = new Date(workDay.date);
            let endDateTime = new Date(workDay.date);
            startDateTime.setHours(workDayBreak.start.substr(0, 2));
            startDateTime.setMinutes(workDayBreak.start.substr(3, 2));
            endDateTime.setHours(workDayBreak.end.substr(0, 2));
            endDateTime.setMinutes(workDayBreak.end.substr(3, 2));
            totalBreaks += Math.abs(startDateTime.getTime() - endDateTime.getTime());
        }
        totalBreaks = totalBreaks / 36e5;
        return totalBreaks;
    }

    public getWorkingHoursByDay(workDay: any) {
        let startDateTime = new Date(workDay.date);
        let endDateTime = new Date(workDay.date);
        startDateTime.setHours(workDay.start_time.substr(0, 2));
        startDateTime.setMinutes(workDay.start_time.substr(3, 2));
        endDateTime.setHours(workDay.end_time.substr(0, 2));
        endDateTime.setMinutes(workDay.end_time.substr(3, 2));
        if (startDateTime.getTime() > endDateTime.getTime()) {
            startDateTime.setDate(startDateTime.getDate() - 1);
        }
        return Math.abs(((startDateTime.getTime() - endDateTime.getTime()) / 36e5) - this.getBreaksByDay(workDay));
    }


    public getSalaryPerDay(workDay: any) {
        let startDateTime = new Date(workDay.date);
        let endDateTime = new Date(workDay.date);
        startDateTime.setHours(workDay.start_time.substr(0, 2));
        startDateTime.setMinutes(workDay.start_time.substr(3, 2));
        endDateTime.setHours(workDay.end_time.substr(0, 2));
        endDateTime.setMinutes(workDay.end_time.substr(3, 2));
        if (startDateTime.getTime() > endDateTime.getTime()) {
            startDateTime.setDate(startDateTime.getDate() - 1);
        }
        return Math.abs(((startDateTime.getTime() - endDateTime.getTime()) / 36e5) - this.getBreaksByDay(workDay));
    }


    public getGroupedWorkDays() {
        let groupedWorkDays = [];
        if (this.data.work_days && this.data.work_days.length > 0) {
            for (let workDay of this.data.work_days) {
                let workDayYear = new Date(workDay.date).getFullYear();
                let workDayMonth = new Date(workDay.date).getMonth();
                if (workDay && workDay.start_time) {
                    if (groupedWorkDays[workDayYear]) {
                        if (groupedWorkDays[workDayYear][workDayMonth]) {
                            groupedWorkDays[workDayYear][workDayMonth].push(workDay);
                            groupedWorkDays[workDayYear][workDayMonth]['work_hours'] += this.getWorkingHoursByDay(workDay);
                        } else {
                            groupedWorkDays[workDayYear][workDayMonth] = [workDay];
                            groupedWorkDays[workDayYear][workDayMonth]['work_hours'] = this.getWorkingHoursByDay(workDay);
                        }
                    } else {
                        groupedWorkDays[workDayYear] = [];
                        groupedWorkDays[workDayYear][workDayMonth] = [workDay];
                        groupedWorkDays[workDayYear][workDayMonth]['work_hours'] = this.getWorkingHoursByDay(workDay);
                    }
                }
            }
        }
        return groupedWorkDays;
    }

}
