import {Component, OnInit, ViewChild} from '@angular/core';
import {Employee} from '../../models/employee';
import {Position} from '../../models/position';
import {FormControl} from '@angular/forms';
import {Schedule} from '../../models/schedule';
import {DocumentPreviewComponent} from '../../components/document-preview/document-preview.component';
import {MatDialog} from '@angular/material';
import {Configurations} from '../../models/configurations';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import printJS from 'print-js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
    selector: 'app-export-import-window',
    templateUrl: './export-import-window.component.html',
    styleUrls: ['./export-import-window.component.scss']
})
export class ExportImportWindowComponent implements OnInit {

    configRef: Configurations;
    config: any;
    @ViewChild('docBody') docBody;
    @ViewChild('table') table;
    calendarDayNumbers: any = [];
    selectedEmployees: any = [];
    employeeList: any = [];
    calendarData: any = [];
    employeeSelectorControl: FormControl = new FormControl();

    constructor(private matDialog: MatDialog) {
    }

    ngOnInit() {
        new Configurations().find('multipliers')
            .then(config => {
                this.configRef = new Configurations();
                this.config = config;
                this.configRef.data = config;
                for (let i = 1; i < 32; i++) {
                    this.calendarDayNumbers.push(i);
                }
                this.getEmployeeList();
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
                    } else {
                        result.push(employee);
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
        new Configurations().find('multipliers').then(config => {
            for (let employee of this.employeeList) {
                for (let selectedEmployee of this.selectedEmployees) {
                    if (employee.id === selectedEmployee) {
                        new Schedule().find(employee.doc.schedule_id)
                            .then(employeeScheduleData => {
                                let employeeSchedule = new Schedule();
                                employeeSchedule.data = employeeScheduleData;
                                employeeSchedule.getGroupedWorkDays().then(employeeWorkDays => {
                                    let employeeFullName = employee.doc.firstname + '_' + employee.doc.lastname;
                                    Object.keys(employeeWorkDays).forEach(year => {
                                        if (employeeWorkDays[year] && employeeWorkDays[year].length > 0) {
                                            if (!this.calendarData['years']) {
                                                this.calendarData['years'] = [];
                                                this.calendarData['years'][year] = [];
                                                this.calendarData['years'][year].year = year;
                                                Object.keys(employeeWorkDays[year]).forEach(month => {
                                                    if (employeeWorkDays[year][month] && employeeWorkDays[year][month]) {
                                                        if (this.calendarData['years'][year]['months']) {
                                                            if (this.calendarData['years'][year]['months'][month]) {
                                                                if (this.calendarData['years'][year]['months'][month]['employees']) {
                                                                    this.calendarData['years'][year]['months'][month]['employees'] = this.calendarData['years'][year]['months'][month]['employees'].filter(emp => emp.employee_id !== employeeFullName);
                                                                    const monthSalary = employeeWorkDays[year][month].work_hours.ordinary_hours * employee.doc.position.pay +
                                                                        employeeWorkDays[year][month].work_hours.night_hours * config.night_time_rate +
                                                                        employeeWorkDays[year][month].work_hours.night_hours * employee.doc.position.pay +
                                                                        employeeWorkDays[year][month].work_hours.holiday_hours * config.holiday_rate;
                                                                    this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                        employee_id: employeeFullName,
                                                                        firstname: employee.doc.firstname,
                                                                        lastname: employee.doc.lastname,
                                                                        work_days: employeeWorkDays[year][month].work_days,
                                                                        position: employee.doc.position ? employee.doc.position : '',
                                                                        month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                    });
                                                                } else {
                                                                    this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                                    this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                        employee_id: employeeFullName,
                                                                        firstname: employee.doc.firstname,
                                                                        lastname: employee.doc.lastname,
                                                                        work_days: employeeWorkDays[year][month].work_days,
                                                                        position: employee.doc.position ? employee.doc.position : '',
                                                                        month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                    });
                                                                }
                                                            } else {
                                                                this.calendarData['years'][year]['months'][month] = [];
                                                                this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                                this.calendarData['years'][year]['months'][month].number = month;
                                                                this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                    employee_id: employeeFullName,
                                                                    firstname: employee.doc.firstname,
                                                                    lastname: employee.doc.lastname,
                                                                    work_days: employeeWorkDays[year][month].work_days,
                                                                    position: employee.doc.position ? employee.doc.position : '',
                                                                    month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                });
                                                            }
                                                        } else {
                                                            this.calendarData['years'][year]['months'] = [];
                                                            this.calendarData['years'][year]['months'][month] = [];
                                                            this.calendarData['years'][year]['months'][month].number = month;
                                                            this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                            this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                employee_id: employeeFullName,
                                                                firstname: employee.doc.firstname,
                                                                lastname: employee.doc.lastname,
                                                                work_days: employeeWorkDays[year][month].work_days,
                                                                position: employee.doc.position ? employee.doc.position : '',
                                                                month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                            });
                                                        }
                                                    }
                                                });
                                            } else {
                                                Object.keys(employeeWorkDays[year]).forEach(month => {
                                                    if (employeeWorkDays[year][month] && employeeWorkDays[year][month]) {
                                                        if (this.calendarData['years'][year]['months']) {
                                                            if (this.calendarData['years'][year]['months'][month]) {
                                                                if (this.calendarData['years'][year]['months'][month]['employees']) {
                                                                    if (this.calendarData['years'][year]['months'][month]['employees']) {
                                                                        this.calendarData['years'][year]['months'][month]['employees'] = this.calendarData['years'][year]['months'][month]['employees'].filter(emp => emp.employee_id !== employeeFullName);
                                                                        this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                            employee_id: employeeFullName,
                                                                            firstname: employee.doc.firstname,
                                                                            lastname: employee.doc.lastname,
                                                                            work_days: employeeWorkDays[year][month].work_days,
                                                                            position: employee.doc.position ? employee.doc.position : '',
                                                                            month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                        });
                                                                    } else {
                                                                        this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                                        this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                            employee_id: employeeFullName,
                                                                            firstname: employee.doc.firstname,
                                                                            lastname: employee.doc.lastname,
                                                                            work_days: employeeWorkDays[year][month].work_days,
                                                                            position: employee.doc.position ? employee.doc.position : '',
                                                                            month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                        });
                                                                    }
                                                                } else {
                                                                    this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                                    this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                        employee_id: employeeFullName,
                                                                        firstname: employee.doc.firstname,
                                                                        lastname: employee.doc.lastname,
                                                                        work_days: employeeWorkDays[year][month].work_days,
                                                                        position: employee.doc.position ? employee.doc.position : '',
                                                                        month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                    });
                                                                }
                                                            } else {
                                                                this.calendarData['years'][year]['months'][month] = [];
                                                                this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                                this.calendarData['years'][year]['months'][month].number = month;
                                                                this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                    employee_id: employeeFullName,
                                                                    firstname: employee.doc.firstname,
                                                                    lastname: employee.doc.lastname,
                                                                    work_days: employeeWorkDays[year][month].work_days,
                                                                    position: employee.doc.position ? employee.doc.position : '',
                                                                    month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                                });
                                                            }
                                                        } else {
                                                            this.calendarData['years'][year]['months'] = [];
                                                            this.calendarData['years'][year]['months'][month] = [];
                                                            this.calendarData['years'][year]['months'][month].number = month;
                                                            this.calendarData['years'][year]['months'][month]['employees'] = [];
                                                            this.calendarData['years'][year]['months'][month]['employees'].push({
                                                                employee_id: employeeFullName,
                                                                firstname: employee.doc.firstname,
                                                                lastname: employee.doc.lastname,
                                                                work_days: employeeWorkDays[year][month].work_days,
                                                                position: employee.doc.position ? employee.doc.position : '',
                                                                month_salary: employeeWorkDays[year][month] ? employeeWorkDays[year][month] : ''
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                });
                            }, reason => {

                            });
                    }
                }
            }

        });
    }

    public getMonth(month: string) {
        return parseInt(month) + 1;
    }

    public closeAndExportPDF() {
        printJS({
            type: 'html',
            printable: 'doc-body',
            documentTitle: 'Tvarkaraščių eksportas',
            style: '*{font-size: 8px; letter-spacing: 0.5px; text-align: center;}'
        });
        // let data = [];
        // for (let year of this.calendarData.years) {
        //     if (year) {
        //         for (let month of year.months) {
        //             if (month) {
        //                 for (let employee of month.employees) {
        //                     let tempWorkDays = [];
        //                     // data.push([parseInt(month.number) + 1 + '/' + year.year]);
        //                     for (let i = 0; i < this.calendarDayNumbers.length; i++) {
        //                         let found: boolean;
        //                         employee.work_days.forEach(workDay => {
        //                             if (this.calendarDayNumbers[i] === new Date(workDay.date).getDate()) {
        //                                 tempWorkDays[this.calendarDayNumbers[i]] = workDay.start_time + '\n' + workDay.end_time + '</strong>';
        //                                 found = true;
        //                                 if (workDay.breaks) {
        //                                     let tempBreakTime = '';
        //                                     workDay.breaks.forEach(breakTime => {
        //                                         tempWorkDays[this.calendarDayNumbers[i]] += '<br><br><span class="break-label">' + breakTime.start + '\n' + breakTime.end + '</span>';
        //                                     });
        //                                 }
        //                             }
        //                         });
        //                         if (!found) {
        //                             tempWorkDays[this.calendarDayNumbers[i]] = ' ';
        //                         }
        //                     }
        //                     const totalWorkHours = employee.month_salary.work_hours.ordinary_hours + employee.month_salary.work_hours.night_hours + employee.month_salary.work_hours.holiday_hours;
        //                     const totalSalary = employee.month_salary.work_hours.ordinary_hours *
        //                         employee.position.pay + employee.month_salary.work_hours.night_hours *
        //                         this.config.night_time_rate +
        //                         employee.month_salary.work_hours.night_hours * employee.position.pay +
        //                         employee.month_salary.work_hours.holiday_hours *
        //                         this.config.holiday_rate;
        //                     const tempArray = tempWorkDays.concat([employee.month_salary.work_hours.ordinary_hours, employee.month_salary.work_hours.night_hours, employee.month_salary.work_hours.holiday_hours, totalWorkHours, totalSalary]);
        //                     tempArray['Darbuotoja(s)'] = employee.firstname + ' ' + employee.lastname;
        //                     tempArray['Pareigos'] = employee.position.job_title;
        //                     tempArray['Paprastų'] = this.precisionRound(employee.month_salary.work_hours.ordinary_hours, 2);
        //                     tempArray['Naktinių'] = this.precisionRound(employee.month_salary.work_hours.night_hours, 2);
        //                     tempArray['Šventinių'] = this.precisionRound(employee.month_salary.work_hours.holiday_hours, 2);
        //                     tempArray['Viso valandų'] = this.precisionRound(totalWorkHours, 2);
        //                     tempArray['Uždarbis'] = this.precisionRound(totalSalary, 2);
        //                     // tempArray['Data'] = parseInt(month.number) + 1 + '/' + year.year;
        //                     data.push(tempArray);
        //                 }
        //             }
        //         }
        //     }
        // }
        // let changedCalendarDayNumbers = [];
        // this.calendarDayNumbers.forEach(calendarDayNumber => {
        //     changedCalendarDayNumbers.push(calendarDayNumber.toString());
        // });
        // pdfMake.vfs = pdfFonts.pdfMake.vfs;
        // let headerRow = [];
        // ['Darbuotoja(s)', 'Pareigos'].concat(changedCalendarDayNumbers.concat(['Paprastų', 'Naktinių', 'Šventinių', 'Viso valandų', 'Uždarbis'])).forEach(item => {
        //     headerRow.push({text: item, style: 'headerItem'});
        // });

        // var dd = {
        //     content: [
        //         {
        //             style: 'outputTable',
        //             layout: 'lightHorizontalLines', // optional
        //             table: {
        //                 // headers are automatically repeated if the table spans over multiple pages
        //                 // you can declare how many rows should be treated as headers
        //                 // headerRows: 1,
        //                 body: [
        //                     headerRow,
        //                     data[0],
        //                     // ['Darbuotoja(s)', 'Pareigos'].concat(changedCalendarDayNumbers.concat(['Paprastų', 'Naktinių', 'Šventinių', 'Viso valandų', 'Uždarbis'])),
        //                     // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
        //                 ],
        //             }
        //         }
        //     ],
        //     styles: {
        //         outputTable: {
        //             fontSize: 5,
        //             margin: [0, 5, 0, 15],
        //         },
        //         headerItem: {
        //             margin: [0, 5, 0, 0],
        //         }
        //     }
        // };
        // pdfMake.createPdf(dd).download();
    }

    public precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

    public closeAndExportXLS() {
        /* generate worksheet */
        let data = [[]];
        for (let year of this.calendarData.years) {
            if (year) {
                for (let month of year.months) {
                    if (month) {
                        data.push([parseInt(month.number) + 1 + '/' + year.year]);
                        data.push(['Darbuotoja(s)', 'Pareigos', ''].concat(this.calendarDayNumbers).concat(['Paprastų', 'Naktinių', 'Šventinių', 'Viso valandų', 'Uždarbis']));
                        for (let employee of month.employees) {
                            let tempWorkDays = [];
                            let tempBreaks = [];
                            for (let calendarDayNumber of this.calendarDayNumbers) {
                                let found: boolean;
                                employee.work_days.forEach(workDay => {
                                    if (calendarDayNumber === new Date(workDay.date).getDate()) {
                                        tempWorkDays.push(workDay.start_time + ' - ' + workDay.end_time);
                                        found = true;
                                        if (workDay.breaks) {
                                            let tempBreakTime = '';
                                            workDay.breaks.forEach(breakTime => {
                                                tempBreakTime += breakTime.start + '-' + breakTime.end + '\n';
                                            });
                                            tempBreaks.push(tempBreakTime);
                                        }
                                    }
                                });
                                if (!found) {
                                    tempWorkDays.push('');
                                    tempBreaks.push('');
                                }
                            }
                            const totalWorkHours = employee.month_salary.work_hours.ordinary_hours + employee.month_salary.work_hours.night_hours + employee.month_salary.work_hours.holiday_hours;
                            const totalSalary = employee.month_salary.work_hours.ordinary_hours *
                                employee.position.pay + employee.month_salary.work_hours.night_hours *
                                this.config.night_time_rate +
                                employee.month_salary.work_hours.night_hours * employee.position.pay +
                                employee.month_salary.work_hours.holiday_hours *
                                this.config.holiday_rate;
                            data.push([employee.firstname + ' ' + employee.lastname, employee.position.job_title, 'Darbo laikas'].concat(tempWorkDays).concat([this.transformTime(employee.month_salary.work_hours.ordinary_hours), this.transformTime(employee.month_salary.work_hours.night_hours), this.transformTime(employee.month_salary.work_hours.holiday_hours), this.transformTime(totalWorkHours), totalSalary]));
                            data.push(['', '', 'Pertraukos'].concat(tempBreaks));
                        }
                    }
                }
            }
        }
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Eksportas');
        /* save to file */
        XLSX.writeFile(wb, 'Eksportas.xlsx');
    }


    public transformTime(value: any): any {
        if (value) {
            console.log('raw dec time: ', value);
            let timeHours = Math.floor(value);
            let timeMinutes = Math.round((value - timeHours) * 60);
            console.log('Hours: ', timeHours);
            console.log('Minutes: ', timeMinutes);
            if (timeHours > 0 && timeMinutes > 0) {
                return timeHours + 'h ' + timeMinutes + 'min';
            } else if (timeHours > 0 && timeMinutes <= 0) {
                return timeHours + 'h';
            } else if (timeHours <= 0 && timeMinutes > 0) {
                return timeMinutes + 'min';
            } else {
                console.log(timeHours + 'h ' + timeMinutes + 'min');
            }
        }
        return '0min';
    }
}
